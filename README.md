# ARCHIVED refer to https://github.com/Luke-G-Cordova/Better-Search for updated versions
# Browser-Search-Regex

Adding functionality to the ctrl+f search function of Google Chrome and other popular search engines

## How to use

Currently BSR is not deployed, so the following are steps to be able to use it

Windows:

- Open command prompt or terminal
- Type `git clone https://github.com/Luke-G-Cordova/browser-regex-search.git`
- Open the directory in VSCode
- Use the keyboard shortcut `ctrl+shift+b`
- Open Chrome and type `chrome://extensions/` into the search bar
- In the top right corner, turn Developer mode on
- In the top left corner, click load unpacked
- Find the directory `~/browser-regex-search/build/chrome` and select the folder
- Reload chrome and it should work!
- If you don't understand or have questions, or have a better way of explaining these instructions, join the discord https://discord.gg/cqChev9w and let me know!

Mac/Linux:

- Good Luck! ��
- Make an issue so that I know there is a need for this type of development so I can write a new build script.

## Contributing

Make an issue for your contribution and submit a pull request if you have found a solution! If you don't know how to do any of that and would still like to contribute, join the discord server for this project at https://discord.gg/cqChev9w .

## Developing

Windows users are in luck, I developed a powershell script to take care of all the build conversions. If you use vscode, you can use the keyboard shortcut `ctrl+shift+b` to start development. Leave it running while you are coding so that it will update your typescript and other files real time. Hitting `ctrl+shift+b` again will quit the development mode and pressing it one more time will restart it. If you find any bugs with it make an issue!

Mac and linux users create an issue if this is hindering your ability to develop. I will write a bash script that does something similar to what I have going on in `bsr.ps1` and `chrome.ps1` when there is a need. Unfortunately the only work around at the moment for Mac and Linux is typing `npx tsc -w` in your CLI to compile your typescript to the build folder and then copying any other non .ts files you may create to the correct place in the build folder and updating them when you make changes.

## Useful links

- Discord: https://discord.gg/cqChev9w
- Chrome extension manifest v3: https://developer.chrome.com/docs/extensions/mv3/manifest/
- html replacement: http://blog.alexanderdickson.com/javascript-replacing-text
