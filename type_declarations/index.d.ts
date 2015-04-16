interface _unorm {
  nfd(str: string): string;
  nfkd(str: string): string;
  nfc(str: string): string;
  nfkc(str: string): string;
}

declare var unorm: _unorm;
