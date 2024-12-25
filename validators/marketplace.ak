use aiken/crypto.{VerificationKeyHash}
use cardano/address
use cardano/transaction.{OutputReference, Transaction, find_input}
use marketplace/types.{MarketplaceDatum, MarketplaceRedeemer}
use marketplace/utils
use cardano/assets.{lovelace_of, without_lovelace}
use aiken/collection/list


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
    let output_platform =
      utils.find_output(outputs, platform_fee, platform_address)
    expect Some(input) = find_input(inputs, output_reference)
    let script_address = input.output.address
    let reference_token =
      input.output.value
        |> without_lovelace()
    when redeemer is {
      Payer -> {
        let seller_sign = must_be_signed_by(transaction, datum.seller)
        when seller_sign is {
          True -> True
          False -> {
            let output_seller =
              find_output(
                outputs,
                datum.price,
                address.from_verification_key(datum.seller),
              )
            let output_author =
              find_output(
                outputs,
                datum.royalties,
                from_verification_key(datum.author),
              )

            let check_none_output =
              utils.check_none(output_seller, output_author, output_platform)
            when check_none_output is {
              True ->
                if datum.seller == datum.author {
                  let list_output =
                    list.filter(
                      outputs,
                      fn(output) {
                        utils.check_output(
                          output,
                          address.from_verification_key(datum.seller),
                        ) && utils.check_amount(output, datum.royalties)
                      },
                    )

                  if list.length(list_output) >= 2 {
                    let list_seller =
                      list.filter(
                        list_output,
                        fn(output) { utils.check_amount(output, datum.price) },
                      )
                    length(list_seller) >= 1
                  } else {
                    False
                  }
                } else {
                  False
                }
              False -> False
            }
          }
        }
      }
      Order -> True
    }
  }

  else(_) {
    fail
  }
}
