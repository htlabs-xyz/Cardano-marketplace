use cardano/address
use cardano/transaction.{OutputReference, Transaction}
use marketplace/types.{MarketplaceDatum, MarketplaceRedeemer}
use marketplace/utils

validator contract {
  spend(
    datum_option: Option<MarketplaceDatum>,
    _redeemer: MarketplaceRedeemer,
    _output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_output) = datum_option
    let Transaction { outputs, .. } = transaction
    let seller_sign = utils.must_be_signed_by(transaction, datum_output.seller)
    when seller_sign is {
      True -> True
      False -> {
        let output_seller =
          utils.find_output(
            outputs,
            datum_output.price,
            address.from_verification_key(datum_output.seller),
          )

        let check_none_output = utils.check_none(output_seller)

        when check_none_output is {
          True -> True
          False -> False
        }
      }
    }
  }

  else(_) {
    fail
  }
}
