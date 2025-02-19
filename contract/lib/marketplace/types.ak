use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId}

pub type MarketplaceDatum {
  policy_id: PolicyId,
  asset_name: AssetName,
  seller: VerificationKeyHash,
  price: Int,
}

