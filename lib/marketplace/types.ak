use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId}

pub type MarketplaceRedeemer {
  Payer
  Order
}

pub type MarketplaceDatum {
  policy_id: PolicyId,
  asset_name: AssetName,
  seller: VerificationKeyHash,
  price: Int,
  royalties: Int,
  author: VerificationKeyHash,
  order: Ord,
}

pub type Ord {
  owner: VerificationKeyHash,
  value: Int,
}
