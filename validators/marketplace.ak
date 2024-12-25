use aiken/crypto.{VerificationKeyHash}
use cardano/address
use cardano/transaction.{OutputReference, Transaction, find_input}
use marketplace/types.{MarketplaceDatum, MarketplaceRedeemer}
use marketplace/utils

validator contract(platform: VerificationKeyHash, platform_fee: Int) {
  spend(
    datum_option: Option<MarketplaceDatum>,
    redeemer: MarketplaceRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_output) = datum_option
    let Transaction { inputs, outputs, mint, extra_signatories, .. } =
      transaction
    let platform_address = address.from_verification_key(platform)
    let output_utxo_platform =
      utils.find_output(outputs, platform_fee, platform_address)
    expect Some(input) = find_input(inputs, output_reference)
    let script_address = input.output.address
    let reference_token =
      input.output.value
        |> without_lovelace()
    when redeemer is {
      Pay -> {
        let seller_sign = must_be_signed_by(transaction, datum.seller)
        when seller_sign is {
          True -> True
          False -> False
        }
      }
      Order -> True
    }
  }

  else(_) {
    fail
  }
}
