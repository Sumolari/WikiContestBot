# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|

  config.vm.box = "puphpet/debian75-x64"

  config.vm.synced_folder "./", "/wikipedia"
  config.vm.provider "parallels" do |vb|
    vb.memory = 512
    vb.cpus = 1
    vb.update_guest_tools = true
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update -yq
    sudo apt-get install -yq build-essential git-core libssl-dev pkg-config libc-ares-dev zlib1g-dev devscripts curl vim
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
    source ~/.bashrc
    nvm install v5
    cd /wikipedia && npm install
  SHELL

end
