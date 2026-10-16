# AI Art Collectible Studio v2.4

Prompt-only Quick Mode Edition.

## 核心
- Quick Mode：先在慣用 AI 上傳圖 → 在本工具選參數 → 複製專用 Prompt → 回原 AI 生成。
- Collector Mode：題名、收藏者、題贈、Edition、落款、材質、銘牌與完整收藏 Prompt。
- 無 API Key、Quick Mode 不上傳圖片、不假裝已連接任何 AI 平台。

## 檔案
- `index.html` 主程式
- `style.css` 樣式
- `app.js` 互動
- `guide.html` 獨立操作指南
- `qa_report.html` Regression 與相容性報告

## 部署
將此資料夾內容放在靜態網站目錄即可。正式手機測試請使用 HTTPS 網址。


## v2.4
新增繁體中文／English／中英對照 Prompt 預覽，並允許直接在預覽框修改、複製目前稿、雙語複製與還原本次生成稿。


## v2.4
新增 7 個「美學微調 Chips」與增量式 Prompt 調整、重複套用防呆、復原上一步；不覆蓋使用者已手動修改內容。

## 作品紀錄迭代（WO-MW-20261016-001）
在原 v2.4 主線加入作品／素材／驗收／配方紀錄，以及完整 JSON 備份還原。無新增生成API、無雲端同步。
- [操作與資料格式](docs/RECORDS-GUIDE.md)
- [本輪結果與待驗項目](docs/WORK-ORDER-RESULT.md)
- [版本整併計畫](docs/VERSION-PLAN.md)
- [匿名示範備份](data/anonymous-example.json)

本輪尚待實際瀏覽器／手機尺寸驗收；舊 PASS 報告不是新功能已通過的證據。
開發檢查：`npm ci --ignore-scripts` → `npm test` → `npm run check`。
新增程式無外部執行期依賴，jsdom 僅供測試；原頁面可沿用原靜態主機開啟。本輪不更改部署。
