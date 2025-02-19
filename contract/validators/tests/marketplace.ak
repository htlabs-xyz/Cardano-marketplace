use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{add, from_lovelace}
use cardano/transaction.{InlineDatum, Input, Transaction}
use marketplace
use marketplace/types.{MarketplaceDatum}
use mocktail.{
  add_input, complete, mocktail_tx, required_signer_hash, tx_in,
  tx_in_inline_datum, tx_out,
}
use mocktail/virgin_address.{mock_pub_key_address, mock_script_address}
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

fn get_buy_test_tx() -> Transaction {
  let input_value =
    from_lovelace(1000) |> add(mock_policy_id(0), "The MarketPlace", 1)

  mocktail_tx()
    |> tx_out(True, mock_pub_key_address(0, None), from_lovelace(1000))
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
}

test success_buy() {
  let redeemer = Void
  let output_reference = mock_utxo_ref(0, 1)

  let tx = get_buy_test_tx()
  marketplace.contract.spend(Some(mock_datum()), redeemer, output_reference, tx)
}
