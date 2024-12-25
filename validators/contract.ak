use cardano/transaction.{OutputReference, Transaction}

validator contract {
  spend(
    datum: Option<Void>,
    redeemer: Void,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    True
  }

  else(_) {
    fail
  }
}
