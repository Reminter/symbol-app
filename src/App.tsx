import React, { useEffect, useState } from 'react';
import {
  AccountInfo,
  Address,
  MosaicId,
  NetworkType,
  RepositoryFactoryHttp,
  UInt64
} from 'symbol-sdk';

function App() {

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [amount, setAmount] = useState<string>("");


  const nodeUrl = 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000';
  const publicKey = 'BAA72C1EFAA886561D76A8C401DA0E24A2D10593A7BCF09C518E35F94CED9F7F';
  const mosaicIdHex = '5B66E76BECAD0860';
  const netWorkType = NetworkType.TEST_NET;


  const address = Address.createFromPublicKey(publicKey, netWorkType);
  const mosaicId = new MosaicId(mosaicIdHex);


  useEffect(() => {

    // 情報の取得
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);

    // アカウント情報
    const accountHttp = repositoryFactory.createAccountRepository();
    accountHttp
      .getAccountInfo(address)
      .subscribe(
        _accountInfo => {
          console.log(_accountInfo)
          setAccountInfo(_accountInfo)
        },
        err => console.log(err)
      );

    // モザイク情報
    const mosaicHttp = repositoryFactory.createMosaicRepository();
    mosaicHttp
      .getMosaic(mosaicId)
      .subscribe(
        _mosaicInfo => {
          console.log(_mosaicInfo)
        },
        err => console.log(err)
      );

    // ノード情報
    const nodeHttp = repositoryFactory.createNodeRepository();
    nodeHttp
      .getNodeInfo()
      .subscribe(
        _nodeInfo => console.log(_nodeInfo),
        err => console.log(err)
      );

    // ネットワーク情報
    const networkHttp = repositoryFactory.createNetworkRepository();

    networkHttp
      .getNetworkProperties()
      .subscribe(
        _networkConfiguration => console.log(_networkConfiguration),
        err => console.log(err)
      )


  }, []);

  useEffect(() => {
    if (accountInfo === null) return;
    setAmount(adjustCurrentUnit(accountInfo.mosaics[0].amount))

  }, [accountInfo]);

  const adjustCurrentUnit = (_amount: UInt64): string => {
    const compact = _amount.compact();
    const unit = compact / 1000000;
    return unit.toString();
  }

  return (
    <>
      <h1>Hello React</h1>
      <h4>publicKey: {accountInfo?.publicKey}</h4>
      <p>保有量: {amount}</p>
    </>
  );
}
export default App;
