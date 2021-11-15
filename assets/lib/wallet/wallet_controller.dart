import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter/services.dart';
import 'package:js/js.dart';
import 'package:js/js_util.dart';
import '../api/api.dart';
import '../widgets/custom_snackbar.dart';

@JS('walletModule.ClientWallet')
class ClientWallet {
  external Future<void> connect();
  external void disconnect();
  external String get address;
  external Future<void> signTransaction();
  external bool isPhantomInstalled();
}

class WalletController extends GetxController {

  bool _connected = false;
  String _pubKey = '';
  final api = API();

  bool get connected => _connected;
  String get pubKey => _pubKey;

  Future<void> connectWallet(context) async {
    ClientWallet wallet = ClientWallet();
    if (wallet.isPhantomInstalled()) {
      await promiseToFuture(wallet.connect());
      _pubKey = wallet.address;
      _connected = true;
      update();
      Navigator.pop(context);
      createSnackbar('success', 'Wallet Connected');
    } else {
      createSnackbar('error', 'No Phantom wallet detected');
    }
  }

  void disconnectWallet() {
    ClientWallet().disconnect();
    _pubKey = '';
    _connected = false;
    update();
  }

  openPicker(context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(
          'Connect To:',
          style: Theme.of(context).textTheme.bodyText1,
        ),
        backgroundColor: Colors.grey[900],
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(15.0))
        ),
        content: InkWell(
          onTap: () => connectWallet(context),
          hoverColor: Colors.white10,
          child: ListTile(
              leading: const CircleAvatar(
                backgroundImage: NetworkImage('https://pbs.twimg.com/profile_images/1394116783792025603/jTMcoZRY.jpg'),
              ),
              title: Text(
                'Phantom',
                style: Theme.of(context).textTheme.bodyText1,
              )
          ),
        ),
      ),
    );
  }

}