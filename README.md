# 🎯 shoot 'em up *bookmarklet*

> Turn any webpage into an element destroying arcade mini-game!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## what is this?

**shoot 'em up** is a javascript bookmarklet, basically a script which turns any website into an arcade game when activated, and cab be saved as a bookmark in the bookmarks tab. In this game, the user has to destroy each and every element in the page using their cursor (clicking page elements destroys them) and be safe from enemy elements which shoot bullets at them too.. pew pewwww boom!

[click here to learn more about bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet)


---

## 🚀 quick setup

1. Display your browser's **Bookmarks Bar** (`Ctrl + Shift + B` or `Cmd + Shift + B`).
2. Create a new bookmark in your bar with any name (e.g., `shoot 'em up`).
3. Copy the following JavaScript snippet and paste it as the **URL / Location** of the bookmark:

```javascript
javascript:(function(){let script=document.createElement('script');script.src='https://damakerdev.github.io/shoot-em-up/shootemup.min.js';document.body.appendChild(script);})();
```
## how to play

* **Aim:** Move your mouse pointer over page elements like a heading, button, etc.
* **Shoot:** Left-click to fire lasers and attack the elements.
* **Dodge:** Some elements like button, image, etc may fire bullets every now and then, avoid those bullets.


### HP values of elements

| HP | Target Tags |
| :--- | :--- |
| **100 HP** | `<h1>`, `<h2>`, `<h3>`, `<img>`, `<button>` |
| **50 HP** | `<video>`, `<canvas>` |
| **20 HP** | `<p>`, `<span>`, `<a>`, `<li>`, `<input>` |


Made with ♥️ by [damakerdev](https://github.com/damakerdev)!
