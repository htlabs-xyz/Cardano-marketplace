use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address
use cardano/assets.{without_lovelace}
use cardano/transaction.{InlineDatum, OutputReference, Transaction, find_input}
use marketplace/types.{MarketplaceDatum, MarketplaceRedeemer, Order, Payer}
use marketplace/utils
use validation/find.{output_by_addr_value}

validator contract(platform: VerificationKeyHash, platform_fee: Int) {
  spend(
    datum_option: Option<MarketplaceDatum>,
    redeemer: MarketplaceRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_output) = datum_option
    let Transaction { inputs, outputs, .. } = transaction
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
        let seller_sign =
          utils.must_be_signed_by(transaction, datum_output.seller)
        when seller_sign is {
          True -> True
          False -> {
            let output_seller =
              utils.find_output(
                outputs,
                datum_output.price,
                address.from_verification_key(datum_output.seller),
              )
            let output_author =
              utils.find_output(
                outputs,
                datum_output.royalties,
                address.from_verification_key(datum_output.author),
              )

            let check_none_output =
              utils.check_none(output_seller, output_author, output_platform)
            when check_none_output is {
              True ->
                if datum_output.seller == datum_output.author {
                  let list_output =
                    list.filter(
                      outputs,
                      fn(output) {
                        utils.check_address(
                          output,
                          address.from_verification_key(datum_output.seller),
                        ) && utils.check_amount(output, datum_output.royalties)
                      },
                    )

                  if list.length(list_output) >= 2 {
                    let list_seller =
                      list.filter(
                        list_output,
                        fn(output) {
                          utils.check_amount(output, datum_output.price)
                        },
                      )
                    list.length(list_seller) >= 1
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
      Order -> {
        let validator_output =
          output_by_addr_value(outputs, script_address, reference_token)
        expect InlineDatum(datum_input) = input.output.datum
        expect datum_input: MarketplaceDatum = datum_input
        and {
          utils.check_output_utxo(validator_output, datum_input, datum_output),
          output_platform != None,
        }
      }
    }
  }

  else(_) {
    fail
  }
}
