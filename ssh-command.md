## How to run

1. Login into server:
```shell 
ssh -i E:\Workplace\gachi-player-ssh\vm-key.pem gachi-admin@<IP>
```
2. Navigate to bot's folder
3. Run it using `nohup`. For example:
```shell
nohup node main.js
```
4. Use `Ctrl+z` to exit output
5. Use `bg` to put it into background
6. Use `jobs` to verify that it worked

## Update code 

Use this command to update it:
```shell
scp -r -i E:\Workplace\gachi-player-ssh\vm-key.pem E:\Workplace\GachiPlayer\ gachi-admin@<IP>:gachi-player 
```

## For new ssh keys 
1. Download key
2. Use commands
    ```powershell
    icacls.exe $path /reset
    icacls.exe $path /GRANT:R "$($env:USERNAME):(R)"
    icacls.exe $path /inheritance:r
    ```
Note `$path` parameter - it should be your own path (for example `E:\Workplace\gachi-player-ssh\vm-key.pem`)

Then use commands above to connect via SSH.
    
## Terminate Bot 

Use this combination to get task and end it: 

```shell 
$ ps -eaf | grep node
gachi-a+  557067       1  0 Feb26 ?        00:04:39 node main.js
gachi-a+  604108  604088  0 09:43 pts/0    00:00:00 grep --color=auto node
$ kill 557067
```