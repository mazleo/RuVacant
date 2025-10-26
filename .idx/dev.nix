{ pkgs, ... }: {
  # Add your Nix packages here
  # e.g. pkgs.my-package

  # For more info, see https://idx.dev/reference/default-nix-file
  packages = [
    pkgs.glib
    pkgs.nss
    pkgs.dbus
    pkgs.gdk-pixbuf
    pkgs.gtk3
    pkgs.xorg.libX11
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXcursor
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXfixes
    pkgs.xorg.libXi
    pkgs.xorg.libXrandr
    pkgs.xorg.libXrender
    pkgs.xorg.libXScrnSaver
    pkgs.xorg.libXtst
    pkgs.alsaLib
    pkgs.at-spi2-atk
    pkgs.cups
    pkgs.expat
    pkgs.pango
    pkgs.udev
    pkgs.chromium
    pkgs.nspr
    pkgs.xorg.libxcb
    pkgs.atk
    pkgs.cairo
    pkgs.dconf
    pkgs.fontconfig
    pkgs.libappindicator-gtk3
    pkgs.liberation_ttf
    pkgs.cacert
    pkgs.libxkbcommon
    pkgs.mesa.drivers
    pkgs.libglvnd
  ];
}
