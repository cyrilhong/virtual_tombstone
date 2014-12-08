為了改成靜態網站，做了一些奇怪的修改...

1. 將資料存成 js 檔(在data中)以便靜態引入。
2. 將 component.js 先經過 jsx 編譯，因此將 component.js 搬到 src 中，再利用 react-tools 編譯到 build 中。
3. html 中的引用從 text/jsx 改成 text/javascript。
4. react 版本從 react-0.11.0.min.js 改成引入 react-0.12.1.min.js。
5. 移除 JSXTransformer 的引用。
6. 改寫 explore.js, tombstone.js，改成可以引入靜態資料。