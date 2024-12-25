use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}
use marketplace/types.{MarketplaceDatum, MarketplaceRedeemer}

validator contract(_platform: VerificationKeyHash, _platform_fee: Int) {
  spend(
    _datum_option: Option<MarketplaceDatum>,
    _redeemer: MarketplaceRedeemer,
    _output_reference: OutputReference,
    _transaction: Transaction,
  ) {
    True
  }

  else(_) {
    fail
  }
}
