use cardano/address
use cardano/transaction.{OutputReference, Transaction}
use marketplace/types.{MarketplaceDatum}
use marketplace/utils

validator contract {
  spend(
    datum_option: Option<MarketplaceDatum>,
    _redeemer: Void,
    _output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_output) = datum_option
    let Transaction { outputs, .. } = transaction
    let seller_sign = utils.must_be_signed_by(transaction, datum_output.seller)
    when seller_sign is {
      True -> True
      False ->
        utils.find_output(
          outputs,
          datum_output.price,
          address.from_verification_key(datum_output.seller),
        ) != None
    }
  }

  else(_) {
    fail
  }
}
