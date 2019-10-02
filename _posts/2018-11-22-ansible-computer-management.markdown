---
layout: post
title: Ansible Computer Management
categories: [system-administration, deployment]
tags: [ruby, yaml]
---

So after finding out about **Ansible** I took a deep dive into the documentation and made myself some scripts to auto-setup my *server* and my *client* pcs. You can find the playbooks in [This](https://github.com/tristaan/software-provision) repo. Please note that these playbooks are heavily inspired by my personal workflow.
**Currently, this is in it's early phase so the configuration is not so straightforward as wanted**


## Initial setup

To start using this you'll need to install a default installation of Archlinux on all your computers, because I made those playbooks only for Arch, but feel free to post pull requests to the repo.

There are many guides available for installation, if you're new and interested I recommend the official [guide](https://wiki.archlinux.org/index.php/Installation_guide), but if you used it before and find the installation time consuming, check out [Anarchy](https://github.com/deadhead420/anarchy-linux).

After you finish the installation. Install the ssh server on all the to-be provisioned machines (Archlinux has a great [guide](https://wiki.archlinux.org/index.php/OpenSSH#Server_usage) exactly for this).
Now after you have all the machines prepared, with working ssh access. Clone the repo on your main machine, I keep all my repos in the `~/build/` folder.

```bash
mkdir ~/build
cd ~/build
git clone https://github.com/deadhead420/anarchy-linux
cd anarchy-linux
```

## Configuring the machines

Edit the `hosts.yaml` file with any editor you like and configure your computers, with the help of this guide.

Edit the variables and set them according to your setup, please note that the first item in *hosted_websites* must equal *default_website*. This is for the certificates to work correctly.

Generate a key pair in the *keys/* directory with `ssh-keygen` and set the *key_name* according to the name.

Execute the playbooks:

```bash
ansible-playbook -i hosts.yml 0_users.yaml
ansible-playbook -i hosts.yml 1_initial.yaml
ansible-playbook -i hosts.yml 2_daemons.yaml
```

After the playbooks are done, edit the sites in `/etc/nginx/sites-enabled` and configure them according to your needs.

You can also customize the playbooks!
