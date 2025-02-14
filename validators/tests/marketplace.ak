use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{add, from_lovelace}
use cardano/transaction.{InlineDatum, Input, Transaction}
use marketplace
use marketplace/types.{MarketplaceDatum}
use mocktail.{
  add_input, complete, mocktail_tx, required_signer_hash, tx_in,
  tx_in_inline_datum, tx_out,
}
use mocktail/virgin_address.{mock_script_address}
use mocktail/virgin_key_hash.{mock_policy_id, mock_pub_key_hash}
use mocktail/virgin_output_reference.{mock_tx_hash, mock_utxo_ref}
use mocktail/virgin_outputs.{mock_script_output}

fn mock_datum() -> MarketplaceDatum {
  MarketplaceDatum {
    asset_name: "The MarketPlace",
    policy_id: mock_policy_id(0),
    seller: mock_pub_key_hash(0),
    price: 1000,
  }
}

// test buy() {
//   let output_reference = mock_utxo_ref(0, 1)
//   let redeemer = Void
// }

type RefundTestCase {
  is_seller_signed: Bool,
}

fn get_refund_test_tx(
  test_case: RefundTestCase,
  seller_sign: VerificationKeyHash,
) -> Transaction {
  let RefundTestCase { is_seller_signed } = test_case
  mocktail_tx()
    |> tx_in(
        True,
        mock_tx_hash(0),
        1,
        from_lovelace(1000),
        mock_script_address(0, None),
      )
    |> tx_in_inline_datum(True, mock_datum())
    |> required_signer_hash(is_seller_signed, seller_sign)
    |> complete()
}

test refund_success() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = Void
  let test_case = RefundTestCase { is_seller_signed: True }
  let tx = get_refund_test_tx(test_case, mock_pub_key_hash(0))
  marketplace.contract.spend(Some(mock_datum()), redeemer, output_reference, tx)
}

test refund_with_non_seller_sign() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = Void
  let test_case = RefundTestCase { is_seller_signed: True }
  let tx = get_refund_test_tx(test_case, mock_pub_key_hash(1))
  marketplace.contract.spend(Some(mock_datum()), redeemer, output_reference, tx)
}

type BuyTestCase {
  is_only_one_input_from_script: Bool,
}

fn get_buy_test_tx(test_case: BuyTestCase) -> Transaction {
  let BuyTestCase { is_only_one_input_from_script } = test_case
  let input_value =
    from_lovelace(1000) |> add(mock_policy_id(0), "The MarketPlace", 1)

  mocktail_tx()
    |> tx_out(
        True,
        mock_pub_key_address(0, None),
        if is_fee_paid {
          from_lovelace(2_000_000)
        } else {
          from_lovelace(1_000_000)
        },
      )
    |> tx_out(
        True,
        mock_pub_key_address(1, None),
        if is_proceed_paid {
          from_lovelace(202_000_000)
        } else {
          from_lovelace(200_000_000)
        },
      )
    |> complete()
    |> add_input(
        True,
        Input {
          output_reference: mock_utxo_ref(0, 1),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
    |> add_input(
        !is_only_one_input_from_script,
        Input {
          output_reference: mock_utxo_ref(0, 2),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
}

test success_buy() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let test_case =
    BuyTestCase {
      is_only_one_input_from_script: True,
      is_fee_paid: True,
      is_proceed_paid: True,
    }

  let tx = get_buy_test_tx(test_case)
  marketplace.marketplace.spend(
    mock_pub_key_address(0, None),
    100,
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_with_multiple_script_inputs() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let test_case =
    BuyTestCase {
      is_only_one_input_from_script: False,
      is_fee_paid: True,
      is_proceed_paid: True,
    }

  let tx = get_buy_test_tx(test_case)
  !marketplace.marketplace.spend(
    mock_pub_key_address(0, None),
    100,
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_without_fee_paid() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let test_case =
    BuyTestCase {
      is_only_one_input_from_script: True,
      is_fee_paid: False,
      is_proceed_paid: True,
    }

  let tx = get_buy_test_tx(test_case)
  !marketplace.marketplace.spend(
    mock_pub_key_address(0, None),
    100,
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_without_proceed_paid() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let test_case =
    BuyTestCase {
      is_only_one_input_from_script: True,
      is_fee_paid: True,
      is_proceed_paid: False,
    }

  let tx = get_buy_test_tx(test_case)
  !marketplace.marketplace.spend(
    mock_pub_key_address(0, None),
    100,
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}
