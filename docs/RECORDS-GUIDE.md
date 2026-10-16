# 作品紀錄操作
1. 首頁按「作品紀錄」。第一次可載入匿名示範，不會自動載入私人作品。
2. 新增作品，填階段、狀態、下一步與缺項。作品編號建立後不因改名而改變。
3. 新增母圖、原始MP4、定稿GIF；填可長期找回的位置或HTTP(S)網址。影片本體不會上傳或存進瀏覽器。
4. 驗收紀錄填項目、程度、確認者、日期、證據位置及結果。工作狀態與證據程度不相同。
5. 保存後匯出JSON。作品、素材、驗收及創作配方都在同一備份。不要把私人備份提交到公開GitHub。
6. 匯入前先下載目前備份並確認保存。合併同ID保留目前資料；取代則完整採用選入備份。錯誤資料不覆蓋。
7. 在快速模式手改Prompt後，回作品紀錄按「保存目前配方」。套用時恢復當時參數與文字，不會自動生成新圖。
8. 想同步另一語言時，可用中文或英文作主稿；工具附上主稿原文作指引，不提供無API自動翻譯。

## 作品資料格式
schemaVersion=1；projects、assets、evidence、recipes四個陣列；素材與證據以projectId關聯。
作品：id/name/stage/status/prompt/settings/textStrategy/next/missing/holdReason/notes/createdAt/updatedAt/checkedAt。
素材：id/projectId/kind/name/version/location/url/verified。
驗收：id/projectId/item/level/by/date/location/url/note/passed。
配方：id/name/fields（必要表單參數與中英Prompt原文）。
單檔2MB；最多500作品、2000素材、5000驗收、100配方。
相同備份內重複ID拒絕；跨備份合併保留現有ID；未知版本拒絕並保留舊資料。
已交付需三種素材有查核及保存位置，並有具確認者、日期、證據位置的通過使用者驗收；不是伺服器自動認證。

## 正式保存
瀏覽器只是工作副本。定稿後保留一份完整JSON在主要文件保存位置，媒體另外保存，總帳只放連結／位置。
私有Library下載連結需要有權限的帳號；移動到別的平台時，請更新素材保存位置。
