import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import {
  Leaf, Globe, Target, CircleDollarSign, BookOpen,
  Search, CheckCircle2, Wind, Sun, Zap, ShieldCheck, ArrowRight, Lightbulb, Map,
  FileText, AlertTriangle, Scale, Building2, Droplets,
  BookMarked, Landmark, Milestone, Box, ClipboardCheck,
  Code, Moon, PieChart, Network, ChevronDown, ChevronUp
} from 'lucide-react';

// --- 深度備考靜態資料庫 ---
const dictionary = [
  // --- 溫室氣體與基礎科學 ---
  { term: 'GWP (全球暖化潛勢)', desc: '考點：Global Warming Potential。衡量不同溫室氣體在特定時間內（通常為100年）相對於二氧化碳的吸收熱量能力。' },
  { term: 'CO2e (二氧化碳當量)', desc: '考點：Carbon Dioxide Equivalent。將不同溫室氣體的排放量，依其GWP值換算成相當於二氧化碳的排放量，以利統一計算。' },
  { term: 'CO2 (二氧化碳)', desc: '考點：最主要的溫室氣體，多來自化石燃料燃燒。GWP值基準為1。' },
  { term: 'CH4 (甲烷)', desc: '考點：GWP值約為28-30 (AR6)。主要來自農業(如牛隻打嗝、水稻田)、天然氣開採與垃圾掩埋場。' },
  { term: 'N2O (氧化亞氮)', desc: '考點：GWP值約為273 (AR6)。俗稱笑氣，主要來源為農業化肥使用及工業製程。' },
  { term: 'HFCs (氫氟碳化物)', desc: '考點：多用於冷氣、冰箱的冷媒。為蒙特婁議定書吉佳利修正案(Kigali Amendment)所管制的溫室氣體。' },
  { term: 'PFCs (全氟碳化物)', desc: '考點：主要來自半導體製程、鋁冶煉等高科技與重工業製程。具備極高的GWP值。' },
  { term: 'SF6 (六氟化硫)', desc: '考點：已知GWP值最高的溫室氣體(大於25,000)。主要用作電力設備(如變壓器)的絕緣氣體。' },
  { term: 'NF3 (三氟化氮)', desc: '考點：GWP值極高。主要用於半導體與光電面板產業的清洗氣體。' },
  { term: '碳匯 (Carbon Sink)', desc: '考點：能從大氣中吸收二氧化碳，並將其固定儲存的自然或人工系統。' },
  { term: '綠碳 (Green Carbon)', desc: '考點：指由「陸地森林生態系」(如樹木、植物) 吸收並儲存的碳。' },
  { term: '藍碳 (Blue Carbon)', desc: '考點：指由「海洋與沿海生態系」(如紅樹林、海草床、鹽沼) 吸收並儲存的碳，吸碳效率極高。' },
  { term: '黃碳 (Yellow Carbon)', desc: '考點：指儲存於「農域與土壤」中的碳，透過友善環境的農耕方式可增加其碳匯量。' },
  { term: '氣候敏感度 (Climate Sensitivity)', desc: '考點：大氣中CO2濃度倍增時，全球平均表面溫度的預期升幅。' },

  // --- 國際公約與倡議 ---
  { term: 'UNFCCC (聯合國氣候變化綱要公約)', desc: '考點：1992年地球高峰會通過，確立了應對氣候變遷的全球框架與「共同但有區別的責任」原則。' },
  { term: 'COP (締約方大會)', desc: '考點：Conference of the Parties。UNFCCC的最高決策機構，每年召開一次國際氣候會議。' },
  { term: '京都議定書 (Kyoto Protocol)', desc: '考點：COP3(1997)通過。史上首次對已開發國家訂定「具法律約束力」減量目標，並引入清潔發展機制(CDM)。' },
  { term: '巴黎協定 (Paris Agreement)', desc: '考點：COP21(2015)通過。目標控制全球升溫在2°C內(努力追求1.5°C內)，採各國自主貢獻(NDC)機制。' },
  { term: '格拉斯哥氣候協議 (Glasgow Climate Pact)', desc: '考點：COP26(2021)。首度將「逐步減少化石燃料」寫入官方決議，並完成巴黎協定第6條規則手冊。' },
  { term: '夏姆錫克施行計畫', desc: '考點：COP27(2022)。達成歷史性協議，設立「損失與損害」(Loss and Damage) 基金協助脆弱國家。' },
  { term: '阿聯酋共識 (UAE Consensus)', desc: '考點：COP28(2023)。完成首次「全球盤點」，要求各國「擺脫化石燃料」，並承諾2030年再生能源產能提高兩倍。' },
  { term: 'IPCC (政府間氣候變化專門委員會)', desc: '考點：聯合國機構。負責提供氣候變遷科學評估報告(如AR6)，為國際氣候政策與談判的科學依據。' },
  { term: 'NDC (國家自定貢獻)', desc: '考點：各締約國依據《巴黎協定》自主提出的國家減碳目標，承諾每5年更新且須提高企圖心(棘輪機制)。' },
  { term: 'CBDR (共同但有區別的責任)', desc: '考點：考量已開發國家歷史排放較多，應承擔比開發中國家更大的氣候減碳責任與資金協助義務。' },
  { term: '全球盤點 (Global Stocktake)', desc: '考點：巴黎協定機制。每5年進行一次，評估全球在實現氣候目標上的集體進展(首次於2023年COP28完成)。' },

  // --- 永續發展與 SDGs ---
  { term: '永續發展 (Sustainable Development)', desc: '考點：1987年《布倫特蘭報告》定義：「滿足當代需求，同時不損及後代滿足其需求的發展。」' },
  { term: 'MDGs (千禧年發展目標)', desc: '考點：SDGs的前身(2000-2015)，當年主要著重於開發中國家的脫貧、疾病等8項目標。' },
  { term: 'SDGs (聯合國永續發展目標)', desc: '考點：2015年發布的17項永續發展目標，核心精神為「不遺落任何人」(Leave No One Behind)。' },
  { term: 'SDG 1 (終結貧窮)', desc: '考點：消除各地一切形式的貧窮。' },
  { term: 'SDG 2 (消除飢餓)', desc: '考點：確保糧食安全，消除飢餓，促進永續農業。' },
  { term: 'SDG 3 (良好健康與福祉)', desc: '考點：確保及促進各年齡層健康生活與福祉。' },
  { term: 'SDG 4 (優質教育)', desc: '考點：確保有教無類、公平以及高品質的教育。' },
  { term: 'SDG 5 (性別平權)', desc: '考點：實現性別平權，賦予婦女權力。' },
  { term: 'SDG 6 (淨水及衛生)', desc: '考點：確保所有人都能享有水、衛生及其永續管理。' },
  { term: 'SDG 7 (可負擔的潔淨能源)', desc: '考點：確保所有的人都可取得負擔得起、可靠的永續現代能源 (呼應淨零與RE100)。' },
  { term: 'SDG 8 (尊嚴就業與經濟發展)', desc: '考點：促進包容且永續的經濟成長，達到全面且有生產力的就業。' },
  { term: 'SDG 9 (產業創新與基礎設施)', desc: '考點：建立具有韌性的基礎建設，促進包容且永續的工業。' },
  { term: 'SDG 10 (減少不平等)', desc: '考點：減少國內及國家間的不平等。' },
  { term: 'SDG 11 (永續城鄉)', desc: '考點：建構具包容、安全、韌性及永續特質的城市與鄉村。' },
  { term: 'SDG 12 (責任消費與生產)', desc: '考點：促進綠色經濟，確保永續消費及生產模式 (呼應循環經濟、ISO 14067)。' },
  { term: 'SDG 13 (氣候行動)', desc: '考點：採取緊急措施以因應氣候變遷及其影響 (永續管理師最核心目標)。' },
  { term: 'SDG 14 (保育海洋生態)', desc: '考點：保育及永續利用海洋生態系 (呼應藍碳)。' },
  { term: 'SDG 15 (保育陸域生態)', desc: '考點：保育及永續利用陸域生態系，確保生物多樣性 (呼應綠碳、黃碳)。' },
  { term: 'SDG 16 (和平、正義與健全制度)', desc: '考點：促進和平多元的社會，確保司法平等。' },
  { term: 'SDG 17 (多元夥伴關係)', desc: '考點：建立多元夥伴關係，協力促進永續願景。' },
  { term: 'ESG (環境、社會與治理)', desc: '考點：Environment, Social, Governance。評估企業永續經營與非財務績效表現的三大核心指標。' },
  { term: 'CSR (企業社會責任)', desc: '考點：Corporate Social Responsibility。企業在創造財務利潤之外，對社會與環境所應主動承擔的責任。' },

  // --- ISO 家族與盤查準則 ---
  { term: 'ISO 14001', desc: '考點：環境管理系統(EMS)國際標準。以PDCA(計畫-執行-查核-行動)循環為基礎，為企業永續的基石。' },
  { term: 'ISO 14064-1', desc: '考點：組織層級溫室氣體盤查標準。2018年新版將排放源邊界重新劃分為「類別1至類別6」。' },
  { term: 'ISO 14064-2', desc: '考點：專案層級溫室氣體減量標準。提供減量專案(如種樹、換高效設備)量化與監測的基準。' },
  { term: 'ISO 14064-3', desc: '考點：溫室氣體聲明之確證與查證指引。主要供第三方查驗機構(如BSI/SGS)執行查核時的依據。' },
  { term: 'ISO 14067', desc: '考點：產品碳足跡(PCF)標準。依據生命週期評估(LCA)量化單一產品從搖籃到墳墓的碳排放。' },
  { term: 'ISO 14068-1', desc: '考點：碳中和管理標準(取代PAS 2060)。嚴格要求企業應「減量優先於抵換」，避免過度依賴買碳權。' },
  { term: 'ISO 14097', desc: '考點：金融業專用。氣候變遷相關投資和財務活動的評估架構與報告。' },
  { term: 'ISO 50001', desc: '考點：能源管理系統標準。核心要求為建立組織的能源基線(EnB)及能源績效指標(EnPI)。' },
  { term: 'ISO 14046', desc: '考點：水足跡(Water Footprint)標準。評估產品、製程或組織生命週期中的用水與水衝擊。' },
  { term: 'ISO 20400', desc: '考點：永續採購指引。協助企業將永續性整合至採購流程中。' },
  { term: 'ISO 46001', desc: '考點：水效率管理系統。協助組織提升用水效率。' },
  { term: 'PAS 2050', desc: '考點：英國BSI發布的全球第一套產品碳足跡標準(後續被ISO 14067取代)。' },
  { term: 'PAS 2060', desc: '考點：早期最知名的碳中和標準(後續被ISO 14068-1取代)。' },
  { term: 'BS 8001', desc: '考點：循環經濟指引。提供組織將循環經濟原則納入營運的實務框架。' },

  // --- 盤查實務與量化 ---
  { term: '基準年 (Base Year)', desc: '考點：盤查中用於比較排放量變化的特定歷史年度。若發生重大併購或計算方法改變需重新計算。' },
  { term: '盤查邊界 (Inventory Boundary)', desc: '考點：確定哪些溫室氣體排放源應納入組織盤查報告的範圍，包含「組織邊界」與「報告邊界」。' },
  { term: '營運控制權法 (Operational Control)', desc: '考點：組織邊界設定法。組織若對某設施具引入及實行營運政策的完全權限，需100%認列其排放(最常見)。' },
  { term: '財務控制權法 (Financial Control)', desc: '考點：組織邊界設定法。組織若能主導該設施的財務政策以獲取經濟利益，則認列100%排放量。' },
  { term: '股權比例法 (Equity Share)', desc: '考點：組織邊界設定法。依據組織在聯營或合資企業中的持股財務比例，來按比例認列碳排放。' },
  { term: '活動數據 (Activity Data, AD)', desc: '考點：產生溫室氣體排放之活動的量化實質數據(如：用電度數、汽油公升數)。' },
  { term: '排放係數 (Emission Factor, EF)', desc: '考點：將活動數據轉換為二氧化碳當量的乘數。優先使用國家環保部門公告係數，其次為國際資料庫。' },
  { term: '直接量測法 (Direct Measurement)', desc: '考點：利用連續排放監測系統(CEMS)直接測量煙囪排放氣體的濃度與流速，精確度最高但成本最貴。' },
  { term: '質量平衡法 (Mass Balance)', desc: '考點：透過製程中物質投入與產出的化學平衡關係來推算排放量(常用於類別1製程排放)。' },
  { term: '不確定性評估 (Uncertainty)', desc: '考點：評估量化數據的準確程度(如儀器量測誤差、係數不精準)，以判定盤查清冊整體的數據品質。' },
  { term: '活動數據品質 (Data Quality)', desc: '考點：實務上區分為初級數據(現場實際蒐集)與次級數據(產業平均或資料庫數據)。' },
  { term: '重大性門檻 (Materiality)', desc: '考點：查證過程中可被接受的誤差或遺漏上限，通常依據企業規模設定在總排量的5%以內。' },

  // --- 查證與確證 ---
  { term: '確證 (Validation)', desc: '考點：針對「未來」將發生的減量專案計畫書進行客觀評估，確認其方法學是否合理且具備外加性。' },
  { term: '查證 (Verification)', desc: '考點：針對「過去」已發生的溫室氣體排放清冊或減量成效，進行歷史真實數據的查核與比對。' },
  { term: '查證聲明 (Verification Statement)', desc: '考點：由第三方查驗機構完成實地查證後，所出具的正式查核合格證明文件。' },
  { term: '合理保證 (Reasonable Assurance)', desc: '考點：高查證等級。查驗員收集充分證據，積極表達盤查結果無重大不實(多要求於類別1與類別2)。' },
  { term: '有限保證 (Limited Assurance)', desc: '考點：低查證等級。基於有限抽樣證據，消極表達未發現盤查結果有錯誤(多用於難以溯源的範疇三)。' },
  { term: '實質不符合 (Material Non-conformity)', desc: '考點：盤查報告存在嚴重錯誤或遺漏，超過重大性門檻，查驗機構將無法發出正面查證聲明。' },
  { term: '外加性 (Additionality)', desc: '考點：減量專案(ISO 14064-2)核心原則。證明該專案若無碳權收入支持將無法執行，其減碳量是額外產生的。' },
  { term: '基線情境 (Baseline Scenario)', desc: '考點：減量專案中，假設「沒有執行該減量專案」時的原始排放狀況，用於比對計算實際減碳量。' },
  { term: '洩漏 (Leakage)', desc: '考點：減量專案雖在邊界內減少了排放，卻導致邊界外排放量增加的現象(需扣除)。' },
  { term: '永久性 (Permanence)', desc: '考點：專案產生的減碳或碳匯效果必須能長期維持，特別針對自然碳匯(如森林大火可能導致逆轉風險)。' },

  // --- 產品碳足跡與LCA ---
  { term: 'LCA (生命週期評估)', desc: '考點：Life Cycle Assessment。ISO 14067 核心基礎，評估產品從原料、製造、配送、使用到廢棄的環境衝擊。' },
  { term: 'PCR (產品類別規則)', desc: '考點：Product Category Rules。同類產品進行碳足跡盤查時的專屬計算指引與規則，確保具備客觀可比較性。' },
  { term: '功能單位 (Functional Unit)', desc: '考點：LCA中具備相關機能的量化基準(如：提供照明1000小時的60W燈泡)，多用於B2C最終產品比較。' },
  { term: '宣告單位 (Declared Unit)', desc: '考點：LCA中當最終功能無法精確定義時的量化基準(如：1噸的鋼材)，多用於B2B中間產品。' },
  { term: '搖籃到墳墓 (Cradle-to-Grave)', desc: '考點：最完整的LCA邊界。涵蓋原料取得、製造、配送、消費者使用到最終廢棄。B2C最終產品必須採用。' },
  { term: '搖籃到大門 (Cradle-to-Gate)', desc: '考點：LCA邊界。僅涵蓋原料取得至產品離開製造廠大門。無法預知終端用途的B2B中間產品必須採用。' },
  { term: '大門到大門 (Gate-to-Gate)', desc: '考點：LCA邊界。範圍最小，僅評估單一製造廠區內的特定製程碳排放。' },
  { term: '截斷準則 (Cut-off Criteria)', desc: '考點：在LCA盤查中，針對重量、體積或環境衝擊極小的微量物料，允許忽略不計的門檻(通常為1%或5%)。' },
  { term: '分配 (Allocation)', desc: '考點：當單一製程產出多種產品(共產品)時，將總碳排依重量、體積或經濟價值比例分攤給各產品的規則。' },
  { term: '初級數據 (Primary Data)', desc: '考點：企業於實際營運現場直接量測或蒐集的第一手數據(如自家廠房電費單)，準確度最高。' },
  { term: '次級數據 (Secondary Data)', desc: '考點：無法取得初級數據時，使用來自文獻、資料庫(如Ecoinvent)的產業平均數據。' },

  // --- GHG Protocol 範疇三細項 ---
  { term: 'GHG Protocol (溫室氣體盤查議定書)', desc: '考點：WRI與WBCSD制定的準則。為SBTi與CDP強制指定的底層碳盤查方法學，分為範疇一、二、三。' },
  { term: '範疇一 (Scope 1)', desc: '考點：直接排放。來自組織擁有或控制的排放源(對應ISO類別1)。' },
  { term: '範疇二 (Scope 2)', desc: '考點：能源間接排放。組織外購電力、熱能或蒸汽所產生的排放(對應ISO類別2)。' },
  { term: '範疇三 (Scope 3)', desc: '考點：價值鏈間接排放。分為上游8項與下游7項，共計15個類別。SBTi審查的核心重點。' },
  { term: '範疇三 類別 1 (採購之商品及服務)', desc: '考點：上游排放。企業購買的原物料、零件或外包服務在生產過程中產生的排放(通常佔比極大)。' },
  { term: '範疇三 類別 2 (資本設備)', desc: '考點：上游排放。企業採購預期使用壽命超過一年的大型設備(如建廠、買機台)所隱含的製造端碳排。' },
  { term: '範疇三 類別 3 (燃料與能源相關活動)', desc: '考點：上游排放。未包含在範疇一二的能源排放，如開採煤炭或發電傳輸過程中的線路耗損(T&D losses)。' },
  { term: '範疇三 類別 4 (上游運輸與配送)', desc: '考點：上游排放。供應商將原物料運送至企業工廠，以及企業支付運費的第三方物流排放。' },
  { term: '範疇三 類別 5 (營運產生之廢棄物)', desc: '考點：上游排放。企業自家工廠產生的廢水、廢棄物交由外部處理商(掩埋、焚化)的排放。' },
  { term: '範疇三 類別 6 (商務旅行)', desc: '考點：上游排放。員工因公出差搭乘飛機、高鐵或計程車的排放(不含日常上下班)。' },
  { term: '範疇三 類別 7 (員工通勤)', desc: '考點：上游排放。員工從住家到公司日常上下班過程中搭乘交通工具的排放(包含遠距辦公的用電)。' },
  { term: '範疇三 類別 8 (上游租賃資產)', desc: '考點：上游排放。企業「身為承租方」租用辦公室或車輛，且未納入範疇一二的排放。' },
  { term: '範疇三 類別 9 (下游運輸與配送)', desc: '考點：下游排放。產品離開工廠運送給客戶的排放(由客戶支付運費的物流)，以及倉儲排放。' },
  { term: '範疇三 類別 10 (售出產品之加工)', desc: '考點：下游排放。企業銷售中間產品(如麵粉)給客戶後，客戶再將其加工(做成麵包)過程的排放。' },
  { term: '範疇三 類別 11 (售出產品之使用)', desc: '考點：下游排放。消費者使用產品時耗用電力或燃料的直接與間接排放(如燃油車耗油、電視耗電)。' },
  { term: '範疇三 類別 12 (售出產品之廢棄)', desc: '考點：下游排放。產品壽命終結後，消費者將其丟棄所產生的掩埋或回收處理排放。' },
  { term: '範疇三 類別 13 (下游租賃資產)', desc: '考點：下游排放。企業「身為出租方」將自有資產(如商辦大樓)租給他人使用時產生的排放。' },
  { term: '範疇三 類別 14 (特許經營)', desc: '考點：下游排放。加盟店(Franchise)日常營運所產生的排放(如超商總部需盤查加盟店的碳排)。' },
  { term: '範疇三 類別 15 (投資)', desc: '考點：下游排放。金融業(銀行、保險、資管)提供投融資給實體企業所產生的「財務碳排放」(Financed Emissions)。' },

  // --- SBTi 與氣候倡議 ---
  { term: 'SBTi (科學基礎減量目標倡議)', desc: '考點：由CDP、UNGC、WRI等發起。協助企業設定符合1.5°C氣候科學路徑的減碳目標，防範漂綠。' },
  { term: '近期目標 (Near-term Target)', desc: '考點：SBTi規範的5-10年內減碳目標。要求Scope 1+2覆蓋率達95%，Scope 3佔比>40%需涵蓋67%。' },
  { term: '長期目標 (Long-term Target)', desc: '考點：SBTi規範的2050年前淨零目標。Scope 1+2+3皆須實質減量90%以上。' },
  { term: '淨零目標 (Net-Zero Target)', desc: '考點：實質減量達90%以上後，剩餘10%內的排放才可使用碳移除(Carbon Removal)進行中和。' },
  { term: 'SME Route (SBTi 中小企業路徑)', desc: '考點：員工數少於500人且非FLAG企業。可直接選擇預設目標，免除繁瑣的範疇三量化審查。' },
  { term: 'FLAG (森林與農業指南)', desc: '考點：SBTi針對特定產業(食品、林業)發布的指南，強制要求將土地利用變更(LUC)排放納入目標。' },
  { term: '剩餘排放 (Residual Emissions)', desc: '考點：企業在窮盡一切技術實質減碳(90%)後，受限於現有科技仍無法完全消除的微小排放量。' },
  { term: 'BVCM (超越價值鏈減緩)', desc: '考點：SBTi鼓勵企業在達成自身價值鏈減碳外，額外提供資金投資外部的氣候行動(如資助雨林保護)。' },
  { term: 'Neutralization (中和)', desc: '考點：SBTi定義。專指使用「碳移除」技術(如種樹、CCUS)來抵銷最後10%的剩餘排放。' },
  { term: 'SDA (跨部門減碳路徑法)', desc: '考點：SBTi設定目標的方法之一。針對均質化的高碳排產業(如鋼鐵、水泥)，以「物理強度」設定減排軌跡。' },
  { term: 'ACA (絕對減量法)', desc: '考點：SBTi設定目標的方法之一。不分產業，要求企業總碳排絕對值每年以固定比例(如線性4.2%)下降。' },
  { term: 'RE100 (100% 再生能源倡議)', desc: '考點：參與的大企業公開承諾，在2050年前達成全球營運據點「100%使用再生電力」(Scope 2)。' },
  { term: 'EP100 (能源生產力倡議)', desc: '考點：承諾將企業的能源使用效率最大化(如產出翻倍或全球據點全面導入ISO 50001能源管理系統)。' },
  { term: 'EV100 (電動車倡議)', desc: '考點：承諾企業自有車隊100%過渡為電動車，並為員工及客戶提供充足的充電基礎設施。' },
  { term: 'CPPA (企業購售電合約)', desc: '考點：企業繞過台電，直接與綠電發電業或售電業簽署的長期再生能源採購合約(RE100認可途徑)。' },
  { term: 'T-REC (台灣再生能源憑證)', desc: '考點：台灣專屬綠電憑證。1張代表1000度(1MWh)綠電環境效益，可用於扣減類別2碳排與RE100達標。' },

  // --- 永續揭露與框架 ---
  { term: 'CDP (原碳揭露專案)', desc: '考點：全球最大的環境揭露評比平台。邀請企業填寫氣候變遷、水安全、森林問卷，並給予A至D-評等。' },
  { term: 'TCFD (氣候相關財務揭露)', desc: '考點：由FSB成立。要求企業從「治理、策略、風險管理、指標與目標」四要素揭露氣候財務風險。' },
  { term: '實體風險 (Physical Risk)', desc: '考點：TCFD分類。因氣候變遷導致的極端天氣(立即性或長期性)對企業實體資產與廠房造成的破壞。' },
  { term: '轉型風險 (Transition Risk)', desc: '考點：TCFD分類。邁向低碳經濟過程中的衝擊，包含政策法規、技術、市場、名譽四類風險。' },
  { term: '政策與法規風險 (Policy & Legal Risk)', desc: '考點：轉型風險之一。因政府開徵碳費、提高碳排限制或遭遇氣候訴訟造成的財務損失。' },
  { term: '技術風險 (Technology Risk)', desc: '考點：轉型風險之一。現有高碳排生產技術被低碳新技術取代，導致舊設備淪為「擱淺資產」。' },
  { term: '市場風險 (Market Risk)', desc: '考點：轉型風險之一。消費者偏好改變(拒買不環保產品)或原物料成本大幅上升造成的營收下滑。' },
  { term: '名譽風險 (Reputation Risk)', desc: '考點：轉型風險之一。企業若爆發漂綠醜聞或抗拒減碳，將損害品牌形象並遭投資人撤資。' },
  { term: '情境分析 (Scenario Analysis)', desc: '考點：TCFD核心要求。企業需評估在不同升溫情境(如1.5°C或高碳排的4°C情境)下，未來財務的潛在衝擊。' },
  { term: 'SASB (永續會計準則)', desc: '考點：以「投資人」為導向，建立SICS行業分類，要求企業揭露具「財務重大性」的行業專屬ESG指標。' },
  { term: 'GRI (全球報告倡議組織)', desc: '考點：以「全面利害關係人」為導向，要求企業揭露營運對環境與社會造成的「影響重大性」(Impact)。' },
  { term: '雙重重大性 (Double Materiality)', desc: '考點：結合GRI與SASB。同時評估ESG議題對企業的「財務重大性」(由外而內)與企業造成的「衝擊重大性」(由內而外)。' },
  { term: 'ISSB (國際永續準則委員會)', desc: '考點：由IFRS成立，整合了SASB與CDSB，發布 IFRS S1 與 S2 成為全球一致的永續財務揭露基準。' },
  { term: 'IFRS S1', desc: '考點：ISSB發布。永續相關財務資訊揭露之「一般規定」(General Requirements)。' },
  { term: 'IFRS S2', desc: '考點：ISSB發布。氣候相關揭露(Climate-related Disclosures)，高度融合TCFD架構。' },
  { term: 'TNFD (自然相關財務揭露)', desc: '考點：繼TCFD後，專注於揭露企業對「自然與生物多樣性」依賴及衝擊的財務風險框架。' },

  // --- 碳市場與碳定價 ---
  { term: '碳定價 (Carbon Pricing)', desc: '考點：將溫室氣體排放的「外部成本」轉化為需支付的貨幣價格(內部化)，主要分為碳稅/費與ETS。' },
  { term: '碳稅 (Carbon Tax)', desc: '考點：由政府訂定固定價格對排碳課稅。「價格確定」，但無法保證國家總減碳效果。' },
  { term: '碳費 (Carbon Fee)', desc: '考點：台灣採用的機制。依法向排放大戶收取費用，且資金須「專款專用」於溫室氣體管理基金。' },
  { term: 'ETS (排放交易體系 / Cap and Trade)', desc: '考點：政府設定排放總量上限(Cap)，發放核配額度允許企業買賣(Trade)。「總量確定」，價格隨市場浮動。' },
  { term: 'CBAM (碳邊境調整機制)', desc: '考點：歐盟實施的碳關稅。針對進口高碳產品課徵碳價，以防範「碳洩漏」(Carbon Leakage)。' },
  { term: '碳洩漏 (Carbon Leakage)', desc: '考點：因某國實施嚴格碳管制，導致企業將高碳排工廠轉移至無管制國家以規避成本的現象。' },
  { term: 'CCA (氣候變遷協議)', desc: '考點：政府與企業簽訂協議，企業承諾達成特定減碳目標以換取碳稅或碳費的減免優惠(如台灣的優惠費率)。' },
  { term: 'Allowance (核配額度)', desc: '考點：在強制性ETS機制中，由政府「核發」或拍賣給企業的合法排放許可(1單位=1噸碳)。' },
  { term: 'Credit (信用額度 / 碳權)', desc: '考點：在自願性市場中，企業透過專案「主動減排或移除」且經第三方驗證後取得的額度，可用於抵換。' },
  { term: '碳抵換 (Carbon Offset)', desc: '考點：企業購買外部專案產生的碳權(Credit)，來補償自身營運無法消除的碳排放量。' },
  { term: 'VCM (自願性碳市場)', desc: '考點：非政府強制，企業基於CSR、ESG或供應鏈要求，自主購買碳權進行抵換的交易市場。' },
  { term: 'CCM (強制性碳市場)', desc: '考點：由國家公權力主導(如歐盟EU ETS)，企業受總量管制必須履約交出足夠額度的市場。' },
  { term: 'VCS (Verra)', desc: '考點：全球發行量最大、最普及的獨立機構碳權認可機制(Verified Carbon Standard)。' },
  { term: 'GS (Gold Standard / 黃金標準)', desc: '考點：由WWF發起。特別強調減量專案必須符合聯合國SDGs與嚴格的社會保障原則(不破壞人權生態)。' },
  { term: 'ITMOs (國際間減量成果轉移)', desc: '考點：巴黎協定第6.2條規範。允許國家之間跨國交易減量成果，以協助達成各自的NDC目標。' },
  { term: 'ICP (內部碳定價)', desc: '考點：企業為內部排碳設定價格，將氣候風險轉化為財務指標，藉以驅動內部部門投資低碳設備。' },
  { term: '影子價格 (Shadow Price)', desc: '考點：ICP形式之一。評估投資案時將虛擬碳成本納入ROI計算，但不會真正向內部部門扣除資金。' },
  { term: '內部碳費 (Internal Fee)', desc: '考點：ICP形式之一。向內部高碳排單位實際收取真金白銀，並將資金成立為內部專屬的減碳基金。' },

  // --- 永續金融 ---
  { term: 'PRI (責任投資原則)', desc: '考點：針對「機構投資人」。要求將ESG因素納入投資決策，並作為積極所有權人要求企業揭露ESG。' },
  { term: 'PRB (責任銀行原則)', desc: '考點：針對「銀行業」。要求核心授信與放貸業務必須與SDGs及巴黎協定目標保持一致。' },
  { term: 'PSI (永續保險原則)', desc: '考點：針對「保險業」。將ESG融入風險管理與產品開發，降低氣候巨災風險。' },
  { term: '赤道原則 (Equator Principles, EPs)', desc: '考點：針對「大型專案融資」。要求開發案(如蓋水壩、電廠)必須通過環境與社會風險評估才能獲得貸款。' },
  { term: '綠色債券 (Green Bond)', desc: '考點：發行人承諾將募得的資金「專款專用」於符合綠色環保定義(如再生能源、低碳建築)的投資計畫。' },
  { term: '社會責任債券 (Social Bond)', desc: '考點：募得資金專用於解決特定社會問題(如提供弱勢平價住宅、醫療基礎設施)。' },
  { term: '可持續發展債券 (Sustainability Bond)', desc: '考點：募得資金同時混合用於「綠色」與「社會」雙重效益的專案投資。' },
  { term: 'SLB (永續發展連結債券)', desc: '考點：資金用途不限，但債券利率與企業整體的ESG績效指標(KPI)與永續目標(SPT)直接掛鉤。' },
  { term: 'SLL (永續連結貸款)', desc: '考點：借款企業若達成預先與銀行約定好的ESG績效指標(如減碳5%)，銀行即提供調降利率等財務誘因。' },
  { term: 'EU Taxonomy (歐盟永續分類標準)', desc: '考點：歐盟制定的官方綠色字典。嚴格定義哪些經濟活動才算「環境永續」，以防堵金融市場漂綠。' },
  { term: '財務碳排放 (Financed Emissions)', desc: '考點：金融機構並非直接排碳，而是透過放貸與投資，間接促成實體經濟排碳(屬範疇三第15類)。' },

  // --- 減量技術與供應鏈 ---
  { term: 'CCUS (碳捕捉、利用與封存)', desc: '考點：將工業排放的CO2捕捉下來，回收轉化為化學品(利用)或深埋於地底儲存(封存)的關鍵減碳技術。' },
  { term: 'DAC (直接空氣捕捉)', desc: '考點：使用巨型風扇與化學溶劑，直接從環境大氣中吸出二氧化碳的負碳技術，目前成本極高。' },
  { term: 'NbS (以自然為本的解決方案)', desc: '考點：Nature-based Solutions。透過保護與復育自然生態系(如造林、濕地保護)來同時解決氣候與生物多樣性危機。' },
  { term: '綠色溢價 (Green Premium)', desc: '考點：選擇採用綠色、零碳技術或產品時，相比傳統高碳排選項所需要多支付的「額外成本」。' },
  { term: '漂綠 (Greenwashing)', desc: '考點：企業誇大或虛假宣傳其環保作為，誤導消費者與投資人，目前面臨嚴格的法規防範與裁罰。' },
  { term: 'PACT (碳透明度夥伴關係)', desc: '考點：WBCSD發起。建立標準化框架解決供應鏈(範疇三)數據不透明、格式不一的問題，推動初級數據交換。' },
  { term: '初級數據交換 (Primary Data Exchange)', desc: '考點：PACT核心精神。上下游企業直接透過API串接傳輸真實碳排數據，擺脫對產業平均資料庫的依賴。' },
  { term: '循環經濟 (Circular Economy)', desc: '考點：打破「開採-製造-丟棄」的線性模式，透過重新設計使資源能持續循環利用(如C2C搖籃到搖籃)。' },

  // --- 台灣政策與法規專區 ---
  { term: '氣候變遷因應法', desc: '考點：台灣氣候母法(原溫減法修正)。2050淨零排放入法，明訂碳費徵收機制、碳交所及氣候調適專章。' },
  { term: '溫室氣體管理基金 (溫管基金)', desc: '考點：法規明訂碳費收入必須「專款專用」放入此基金，專門用於補助減量工作與氣候調適。' },
  { term: '碳費審議委員會', desc: '考點：負責審議決定台灣碳費費率的官方組織，由學者專家、民間團體與政府機關組成。' },
  { term: '自主減量計畫 (優惠費率)', desc: '考點：排放大戶若提出且執行符合指定目標(如SBT)的減碳計畫，可向環境部申請適用較低的「優惠碳費費率」。' },
  { term: '自願減量專案', desc: '考點：台灣本土的碳權生成機制。非管制對象執行減量措施，經查驗後可取得環境部核發之減量額度(碳權)。' },
  { term: '增量抵換', desc: '考點：環評要求。大型開發案(如建園區)若會增加碳排，必須購買外部碳權或採取行動(如汰換老舊機車)來抵銷其增量。' },
  { term: '台灣碳權交易所 (TCX)', desc: '考點：台灣唯一的官方碳交易所，負責國外碳權代購、國內減量額度交易與相關碳諮詢服務。' },
  { term: '國家發展委員會 (國發會)', desc: '考點：台灣「2050淨零排放路徑」及十二項關鍵戰略的主導與統籌規劃機關。' },
  { term: '行政院國家永續發展委員會 (永續會)', desc: '考點：負責協調整合國家跨部會永續發展與氣候變遷因應事務的最高層級會報。' },
  { term: '用電大戶條款', desc: '考點：規範契約容量達5000瓩以上的企業，必須設置一定比例的再生能源發電設備或購買綠電憑證。' },
  { term: '十二項關鍵戰略', desc: '考點：台灣淨零路徑具體計畫，包含風電光電、氫能、CCUS、資源循環零廢棄、綠色金融、公正轉型等。' },
  { term: '綠色金融行動方案 3.0', desc: '考點：金管會推動。核心為建立「永續經濟活動認定指引」(台版Taxonomy)，並推動金融業溫室氣體盤查。' }
];

// --- 共用組件 ---

interface TabItem {
  id: string;
  label: string;
}

const SubTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 mb-6 pb-2 hide-scrollbar">
    <div className="flex gap-2">
      {tabs.map((tab: TabItem) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-5 py-2.5 rounded-t-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

interface QuizModuleProps {
  quizData: QuizQuestion;
  unitTitle: string;
  onAnswer: (index: number, correct: boolean) => void;
  qIndex: number;
}

const QuizModule = ({
  quizData,
  unitTitle,
  onAnswer,
  qIndex,
}: QuizModuleProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // 當題目切換(qIndex改變或本身更新)時，重置作答狀態
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [quizData]);

  if (!quizData || !quizData.options || quizData.options.length === 0) return null;

  return (
    <div className="p-6 bg-slate-800 dark:bg-slate-900 text-white rounded-2xl border border-slate-700 dark:border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-emerald-400">
        <Lightbulb className="w-6 h-6" />
        <h3 className="text-xl font-bold">考前實戰測驗</h3>
      </div>
      {unitTitle && <div className="text-emerald-300 text-sm font-bold mb-4 tracking-wider">{unitTitle}</div>}
      <p className="text-lg font-medium mb-6 leading-relaxed">{String(quizData.question)}</p>
      <div className="space-y-3">
        {quizData.options.map((opt: string, idx: number) => (
          <button
            key={idx}
            onClick={() => !submitted && setSelected(idx)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${selected === idx
                ? 'border-emerald-500 bg-emerald-900/30'
                : 'border-slate-600 dark:border-slate-700 bg-slate-700 dark:bg-slate-800 hover:border-slate-400'
              } ${submitted && idx === quizData.answer ? 'bg-emerald-600 border-emerald-400' : ''} 
              ${submitted && selected === idx && selected !== quizData.answer ? 'bg-red-900/50 border-red-500' : ''}`}
          >
            {String(opt)}
          </button>
        ))}
      </div>
      {!submitted ? (
        <button
          onClick={() => {
            setSubmitted(true);
            if (onAnswer) onAnswer(qIndex, selected === quizData.answer);
          }}
          disabled={selected === null}
          className="mt-6 px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto transition-colors"
        >
          送出答案解析
        </button>
      ) : (
        <div className={`mt-6 p-5 rounded-xl border ${selected === quizData.answer ? 'bg-emerald-900/50 border-emerald-500' : 'bg-orange-900/50 border-orange-500'}`}>
          <p className="font-bold text-lg mb-2 flex items-center gap-2">
            {selected === quizData.answer ? <><CheckCircle2 className="text-emerald-400" /> 答對了！這是一定要拿下的基本分。</> : <><AlertTriangle className="text-orange-400" /> 答錯囉！請務必熟記下方解析。</>}
          </p>
          <p className="text-slate-300 leading-relaxed">{String(quizData.explanation)}</p>
        </div>
      )}
    </div>
  );
};

// --- 單元一：政策法規與趨勢 ---

const Section1 = () => {
  const [subTab, setSubTab] = useState('nouns');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <Globe className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          單元一：永續趨勢與我國氣候法規
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">必考重點：核心名詞定義、氣候變遷因應法條文、全球公約演進</p>
      </header>

      <SubTabs
        tabs={[
          { id: 'nouns', label: '核心名詞深度檢視' },
          { id: 'law', label: '我國《氣候變遷因應法》' },
          { id: 'global', label: '全球氣候公約歷程' }
        ]}
        activeTab={subTab}
        setActiveTab={setSubTab}
      />

      {subTab === 'nouns' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2"><BookMarked className="text-blue-600 dark:text-blue-400" /> 考前必背：核心名詞解析</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-1">SDGs (聯合國永續發展目標)</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">2015-2030 | 17項目標 | 169項細項目標</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">取代2000年的MDGs(千禧年發展目標)。核心精神為<strong>「不遺落任何人」(Leave No One Behind)</strong>。兼顧經濟成長、社會進步與環境保護三大面向。</p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-1">CBDR (共同但有區別的責任)</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">Common But Differentiated Responsibilities</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">1992年UNFCCC確立的核心原則。承認所有國家對環境都有責任（共同），但已開發國家因歷史排放較多，應承擔更大責任與減量目標（有區別）。</p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-1">NDC (國家自定貢獻)</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">Nationally Determined Contributions</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">《巴黎協定》的核心機制。各國「由下而上」自主提出減碳目標，並承諾<strong>每5年更新一次</strong>，且新目標必須比前一次更具企圖心（棘輪機制）。</p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-1">Mitigation (減量) vs. Adaptation (調適)</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">氣候變遷因應法兩大主軸</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>減量：</strong>從源頭減少溫室氣體排放或增加碳匯（治本）。<br /><strong>調適：</strong>因應已發生的氣候變遷衝擊，建立韌性、減少災害與風險（治標）。</p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl md:col-span-2 hover:border-blue-300 transition-colors shadow-sm">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-lg mb-1">Just Transition (公正轉型)</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">《氣候變遷因應法》第46-1條明訂</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">在邁向淨零排放的過程中，必須確保不遺落任何人。政府與企業應協助因轉型而受衝擊的<strong>勞工（如燃煤電廠員工）、產業、地區及原住民族</strong>，提供輔導、補償與穩定轉型的機制。</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'law' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2"><Scale className="text-emerald-600 dark:text-emerald-400" /> 條文考點解析</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <div className="text-blue-800 dark:text-blue-300 font-black text-xl mb-2 border-b border-blue-200 dark:border-blue-800/50 pb-2">第 4 條：2050 淨零入法</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">國家長期減量目標為<strong className="text-blue-600 dark:text-blue-400">民國139年 (2050年) 溫室氣體淨零排放</strong>。各級政府應與國民、事業、團體共同推動。</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="text-emerald-800 dark:text-emerald-300 font-black text-xl mb-2 border-b border-emerald-200 dark:border-emerald-800/50 pb-2">第 8 條：強化氣候治理</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">強化<strong className="text-emerald-600 dark:text-emerald-400">5年一期</strong>國家溫室氣體階段管制目標及方案。由「行政院永續會」協調整合跨部會氣候變遷因應事務。</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/50">
              <div className="text-orange-800 dark:text-orange-300 font-black text-xl mb-2 border-b border-orange-200 dark:border-orange-800/50 pb-2">第 8-2-16 條：增加調適專章</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">氣候變遷調適由<strong className="text-orange-600 dark:text-orange-400">環境部</strong>與<strong className="text-orange-600 dark:text-orange-400">國家發展委員會</strong>主辦，各中央目的事業主管機關協辦。建構韌性臺灣。</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50">
              <div className="text-purple-800 dark:text-purple-300 font-black text-xl mb-2 border-b border-purple-200 dark:border-purple-800/50 pb-2">第 24-28 條：碳費徵收機制</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">針對首波受管制的排放大戶（約500廠/場，占全台排放54%）課徵碳費。明訂碳費將<strong>專款專用</strong>於溫室氣體減量與氣候調適（成立溫室氣體管理基金）。</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'global' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2"><Milestone className="text-indigo-600 dark:text-indigo-400" /> 必考公約發展時間軸</h3>
          <div className="relative border-l-4 border-indigo-200 dark:border-indigo-800/50 ml-4 md:ml-1/2 space-y-12 py-4">
            {[
              { year: '1987', title: '《我們共同的未來》', subtitle: 'Brundtland Report', desc: '布倫特蘭委員會發布報告，首次明確定義「永續發展」：滿足當代需求，同時不損及後代滿足其需求的發展。' },
              { year: '1992', title: '地球高峰會 & UNFCCC', subtitle: '里約熱內盧', desc: '通過《聯合國氣候變化綱要公約》(UNFCCC)，確立「共同但有區別的責任(CBDR)」原則。' },
              { year: '1997', title: '京都議定書 (Kyoto Protocol)', subtitle: 'COP3 (日本京都)', desc: '首次對已開發國家(附件一國家)制定「具法律約束力」的溫室氣體減量目標。導入了排放交易(ETS)、清潔發展機制(CDM)等彈性機制。' },
              { year: '2015', title: 'SDGs 與 巴黎協定', subtitle: 'COP21 (法國巴黎)', desc: '聯合國通過17項SDGs；同年通過《巴黎協定》，目標控制全球升溫在2°C內並努力限制在1.5°C內。捨棄由上而下的強制分配，改採各國自主提報NDC機制。' },
              { year: '2021', title: '格拉斯哥氣候協議', subtitle: 'COP26 (英國格拉斯哥)', desc: '首度將「逐步減少化石燃料」寫入官方決議，並完成《巴黎協定》第6條(全球碳市場機制)的規則手冊。' },
              { year: '2022', title: '夏姆錫克施行計畫', subtitle: 'COP27 (埃及夏姆錫克)', desc: '達成歷史性協議，設立「損失與損害」(Loss and Damage) 基金，協助脆弱國家應對氣候災難。' },
              { year: '2023', title: '阿聯酋共識', subtitle: 'COP28 (阿聯酋杜拜)', desc: '完成首次「全球盤點」(Global Stocktake)，決議要求各國「擺脫 (Transition away from) 化石燃料」，並承諾2030年再生能源產能提高兩倍。' },
            ].map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                <div className="md:w-1/2 md:pr-12 md:text-right relative">
                  <div className="absolute left-[-42px] md:left-auto md:right-[-10px] top-1 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-800 shadow-md"></div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl hover:shadow-md transition-shadow border border-indigo-100 dark:border-indigo-900/50 text-left md:text-right">
                    <span className="text-indigo-700 dark:text-indigo-400 font-black text-2xl tracking-wider">{item.year}</span>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">{item.title}</h4>
                    <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400 mb-2">{item.subtitle}</p>
                    <p className="text-md text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// --- 單元二：ISO 標準與碳盤查 ---

const Section2 = () => {
  const [subTab, setSubTab] = useState('iso14064');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 w-8 h-8" />
          單元二：國際標準與盤查實務
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">必考重點：ISO 14064-1組織盤查、ISO 14067產品碳足跡、邊界劃分與生命週期</p>
      </header>

      <SubTabs
        tabs={[
          { id: 'iso14064', label: 'ISO 14064-1 組織碳盤查' },
          { id: 'categories', label: '盤查邊界：六大類別解析' },
          { id: 'iso14067', label: 'ISO 14067 產品碳足跡' },
          { id: 'family', label: 'ISO 14060 家族標準整理' }
        ]}
        activeTab={subTab}
        setActiveTab={setSubTab}
      />

      {subTab === 'iso14064' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">ISO 14064-1 盤查五大重點邏輯</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xl">1</div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">邊界設定 (Boundary Setting)</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">考試最常考兩種方法：<strong>營運控制權法</strong>（最常見，管得到的算你的）與 <strong>股權比例法</strong>（按投資比例拆分）。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xl">2</div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">排放源識別</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">2018年版將排放源分為 <strong>類別 1 到 類別 6</strong>。取代了舊版單純的範疇1,2,3。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xl">3</div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">係數選擇</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">排放量 = 活動數據 × 排放係數 × GWP值。優先使用國家公告係數（如環境部係數庫）。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xl">4</div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">數據品質評估與量化</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">評估數據的不確定性，建立清冊與盤查報告書。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xl">5</div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">查證 (Verification)</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1">由第三方查證單位（如BSI, SGS, 依據 ISO 14064-3 執行）進行確證或查證，發布查證聲明。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'categories' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 bg-slate-100 dark:bg-slate-700 p-4 rounded-xl border border-slate-300 dark:border-slate-600">ISO 14064-1:2018 六大報告邊界類別</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-2xl">
              <h4 className="font-black text-red-800 dark:text-red-400 text-lg mb-2">類別 1：直接排放與移除</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">【強制量化】對應舊版 Scope 1</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>固定燃燒 (發電機柴油)</li>
                <li>移動燃燒 (公務車汽油)</li>
                <li>製程排放 (化學反應)</li>
                <li>逸散排放 (冷媒、化糞池)</li>
                <li>土地利用變更 / 林業</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl">
              <h4 className="font-black text-yellow-800 dark:text-yellow-500 text-lg mb-2">類別 2：輸入能源間接排放</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">【依重大性準則量化】對應舊版 Scope 2</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>外購電力 (台電電費單)</li>
                <li>外購電力以外能源 (蒸汽、熱能)</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <h4 className="font-black text-blue-800 dark:text-blue-400 text-lg mb-2">類別 3：運輸間接排放</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">【依重大性準則量化】對應舊版 Scope 3</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>貨物上下游運輸配送</li>
                <li>員工通勤</li>
                <li>商務旅行 (高鐵、飛機)</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
              <h4 className="font-black text-indigo-800 dark:text-indigo-400 text-lg mb-2">類別 4：組織使用產品間接排放</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">【依重大性準則量化】採購物料</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>採購的商品與服務 (原物料、包材)</li>
                <li>資本設備 (機器、建築)</li>
                <li>營運產生之廢棄物處理</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
              <h4 className="font-black text-purple-800 dark:text-purple-400 text-lg mb-2">類別 5：使用組織產品間接排放</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">【依重大性準則量化】賣出產品後</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>產品的使用階段 (吃電產品)</li>
                <li>產品的最終處理階段 (廢棄)</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 rounded-2xl">
              <h4 className="font-black text-slate-800 dark:text-slate-200 text-lg mb-2">類別 6：其他間接排放</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">無法歸類於3,4,5的其他項目</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                <li>投資過程 (股權、融資) 產生的碳排</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'iso14067' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
            <Box className="text-emerald-600 dark:text-emerald-400 w-7 h-7" /> ISO 14067 產品碳足跡 (PCF)
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-8 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-base leading-relaxed">
            <strong>核心觀念：</strong>有別於 ISO 14064-1 針對「整個組織營運」，ISO 14067 專注於「單一產品或服務」。運用<strong>生命週期評估 (LCA)</strong> 的方法，計算產品從無到有的每一滴碳排放。這也是應對歐盟 CBAM 與國際供應鏈要求（如 Apple 要求供應商提供低碳產品）的關鍵標準。
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h4 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-2">生命週期三大系統邊界 (必考)</h4>
              <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
                  <span className="font-black text-emerald-800 dark:text-emerald-400 text-lg mb-1">1. 搖籃到墳墓 (Cradle-to-Grave)</span>
                  <span className="leading-relaxed">最完整的評估，涵蓋：原料取得 → 製造 → 運輸配送 → 使用 → 最終廢棄處理。<strong className="text-emerald-600 dark:text-emerald-400">B2C (企業對消費者) 的最終產品</strong>通常必須採用此邊界。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
                  <span className="font-black text-emerald-800 dark:text-emerald-400 text-lg mb-1">2. 搖籃到大門 (Cradle-to-Gate)</span>
                  <span className="leading-relaxed">涵蓋：原料取得 → 製造 (直到產品離開工廠大門，準備出貨)。常見於 <strong className="text-emerald-600 dark:text-emerald-400">B2B (企業對企業) 的中間產品、原物料</strong>。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
                  <span className="font-black text-emerald-800 dark:text-emerald-400 text-lg mb-1">3. 大門到大門 (Gate-to-Gate)</span>
                  <span className="leading-relaxed">僅評估單一製造階段或自家工廠內特定製程的碳排放。</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h4 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-2">計算規則與單位陷阱題</h4>
              <ul className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
                <li>
                  <strong className="text-blue-700 dark:text-blue-300 block text-lg font-black mb-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded w-fit">功能單位 (Functional Unit)</strong>
                  <p className="leading-relaxed mt-2">為具備相關機能之量化績效，確保比較時的基準一致。<br /><strong>考點舉例：</strong>一顆 60W、壽命 1000 小時的 LED 燈泡提供照明的功能。（用於搖籃到墳墓的最終產品）</p>
                </li>
                <li>
                  <strong className="text-orange-700 dark:text-orange-300 block text-lg font-black mb-1 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded w-fit">宣告單位 (Declared Unit)</strong>
                  <p className="leading-relaxed mt-2">當產品最終功能無法精確定義，或只做「搖籃到大門」評估時使用。<br /><strong>考點舉例：</strong>1 公噸的鋼板、1 公斤的塑膠粒。（後續用途未知）</p>
                </li>
                <li>
                  <strong className="text-purple-700 dark:text-purple-300 block text-lg font-black mb-1 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded w-fit">產品類別規則 (PCR)</strong>
                  <p className="leading-relaxed mt-2">同行業的同類產品必須依循「同一套計算指引規則 (Product Category Rules)」來計算碳足跡，這樣算出來的數據才能在市場上互相比對。若無既有 PCR 可用，企業可能需要向主管機關提案新訂。</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'family' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">ISO 家族標準快速記憶對照表</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-900 font-black text-slate-800 dark:text-slate-200">
                <tr>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700 w-1/3">ISO 代碼</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700">核心定義與考點</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14001</td>
                  <td className="p-4">環境管理系統 (EMS) 基礎。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14064-1</td>
                  <td className="p-4">組織層級溫室氣體盤查 (Organization level)。定義營運邊界與量化類別。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14064-2</td>
                  <td className="p-4">專案層級減量活動 (Project level)。提供確證與查證的專案基礎（如種樹、換燈管拿碳權）。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14064-3</td>
                  <td className="p-4">溫室氣體聲明之「確證 (Validation) 與查證 (Verification)」指引（給查驗機構看的）。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14067</td>
                  <td className="p-4">產品碳足跡 (Product Carbon Footprint)。評估單一產品生命週期(LCA)的排放。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14068-1</td>
                  <td className="p-4">氣候變化管理─「碳中和」標準。取代PAS 2060，強調減量優先於抵換。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 14097</td>
                  <td className="p-4">金融業專用：氣候變遷相關投資和財務活動的評估架構。</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">ISO 50001</td>
                  <td className="p-4">能源管理系統。建立能源基線(EnB)及能源績效指標(EnPI)。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

// --- 單元三：倡議與治理 ---

const Section3 = () => {
  const [subTab, setSubTab] = useState('ghg');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <Map className="text-purple-600 dark:text-purple-400 w-8 h-8" />
          單元三：企業氣候治理與倡議
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">必考重點：GHG Protocol盤查範疇、SBTi 目標設定條件、RE100、TCFD與SASB財務揭露</p>
      </header>

      <SubTabs
        tabs={[
          { id: 'ghg', label: 'GHG Protocol 盤查範疇' },
          { id: 'sbti', label: 'SBTi 科學基礎減量目標' },
          { id: 're100', label: 'RE100 再生能源倡議' },
          { id: 'tcfd', label: 'TCFD 氣候財務揭露' },
          { id: 'sasb', label: 'SASB 永續會計準則' },
          { id: 'pact', label: 'PACT 供應鏈碳透明' },
          { id: 'guide', label: '淨零實踐指南' }
        ]}
        activeTab={subTab}
        setActiveTab={setSubTab}
      />

      {subTab === 'ghg' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
              <Building2 className="w-6 h-6" /> GHG Protocol 企業溫室氣體盤查核心指南
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-8 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-base leading-relaxed">
            企業在進行溫室氣體盤查時，依據營運邊界與排放源的控制力，將排放分為三大範疇 (Scope 1, 2, 3)。此分類與 ISO 14064-1 高度相關，更是各大永續資訊揭露框架（SASB、GRI、TCFD）與目標設定（SBTi）的共同溝通基礎。
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-red-100 dark:border-red-900/50 rounded-2xl p-6 bg-red-50/50 dark:bg-red-900/10">
              <h4 className="font-black text-xl text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-300 text-sm">1</div>
                範疇一 (Scope 1)：直接排放
              </h4>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-red-200 dark:border-red-800/50 pb-2">來自於企業所擁有或具備營運控制權的排放源所產生的直接排放。</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
                <li><strong className="text-slate-800 dark:text-slate-200">固定燃燒源：</strong>如發電機、鍋爐等燃燒化石燃料且無移動能力的固定設備。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">移動燃燒源：</strong>如公務車、柴油堆高機等消耗燃油的交通與運輸工具。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">製程排放：</strong>物理或化學製程中產生的排放（如水泥窯、半導體蝕刻）。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">逸散性排放：</strong>如冷媒漏逸、化糞池、滅火器等非人為蓄意控制的氣體逸散。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">土地利用變更：</strong>因開發建廠等直接改變土地使用狀態而造成的碳匯流失。</li>
              </ul>
            </div>

            <div className="border-2 border-yellow-100 dark:border-yellow-900/50 rounded-2xl p-6 bg-yellow-50/50 dark:bg-yellow-900/10">
              <h4 className="font-black text-xl text-yellow-800 dark:text-yellow-500 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-sm">2</div>
                範疇二 (Scope 2)：能源間接排放
              </h4>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-yellow-200 dark:border-yellow-800/50 pb-2">企業自用之輸入能源（須經過次級處理），在供應端燃燒化石燃料所產生的間接排放。</p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 mt-4">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> <strong className="text-slate-800 dark:text-slate-200">外購電力</strong></li>
                <li className="flex items-center gap-2"><Sun className="w-4 h-4 text-orange-500" /> <strong className="text-slate-800 dark:text-slate-200">外購熱能</strong></li>
                <li className="flex items-center gap-2"><Wind className="w-4 h-4 text-blue-400" /> <strong className="text-slate-800 dark:text-slate-200">外購蒸汽</strong></li>
              </ul>
            </div>
          </div>

          <div className="border-2 border-blue-100 dark:border-blue-900/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-5 border-b border-blue-100 dark:border-blue-900/50">
              <h4 className="font-black text-xl text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 text-sm">3</div>
                範疇三 (Scope 3)：其他間接溫室氣體排放
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">涵蓋企業價值鏈（Value Chain）上下游活動所衍生的所有間接排放，共細分為 15 個類別。</p>
            </div>

            <div className="w-full">
              <table className="w-full text-left text-xs md:text-sm text-slate-700 dark:text-slate-300 border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/80 font-black text-slate-800 dark:text-slate-200 text-center">
                  <tr>
                    <th className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 w-[12%] md:w-[10%] leading-relaxed">價值鏈分類</th>
                    <th className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 w-[33%] md:w-[28%] leading-relaxed">GHG Protocol 範疇三 (Scope 3)</th>
                    <th className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 w-[15%] md:w-[12%] leading-relaxed">對應 ISO 14064-1:2018</th>
                    <th className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 w-[40%] md:w-[50%] leading-relaxed">ISO 14064-1 子項目 / 說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 leading-relaxed md:leading-loose">
                  {/* 上游活動 8 項 */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td rowSpan={8} className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-800 dark:text-emerald-400 align-middle text-center">
                      上游活動<br className="hidden md:block" />(Upstream)<br /><span className="text-[10px] md:text-xs font-normal text-emerald-600 dark:text-emerald-500 mt-2 block leading-snug">企業花錢採購<br />所衍生的排放</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.1</span>
                      購買的商品與服務 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Purchased goods and services)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 4 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 4)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">組織使用產品</strong>
                      購買商品、原物料及消耗品等相關排放。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.2</span>
                      資本財 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Capital goods)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 4 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 4)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">組織使用產品</strong>
                      資本貨物/資本財 (如：購買的機器設備、廠房建築等設施的生產排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.3</span>
                      燃料與能源相關活動 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Fuel and energy related activities)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 4 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 4)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">組織使用產品</strong>
                      (未包含在 Scope 1 & 2 中) 上游燃料的開採、生產與運輸所產生的排放。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.4</span>
                      上游運輸與配送 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Upstream transportation and distribution)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 3 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 3)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">運輸</strong>
                      上游運輸和貨物配送 (如：供應商將貨物運送至企業端，由第三方物流執行的排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.5</span>
                      營運產生之廢棄物 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Waste generated in operations)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 4 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 4)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">組織使用產品</strong>
                      廢棄物處理 (委外處理營運過程產生的事業或一般廢棄物)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.6</span>
                      商務旅行 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Business travel)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 3 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 3)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">運輸</strong>
                      商務旅行 (員工因公出差搭乘高鐵、飛機等非公司自有車輛的排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.7</span>
                      員工通勤 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Employee commuting)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 3 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 3)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">運輸</strong>
                      員工通勤 (包含遠距辦公產生的排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.8</span>
                      上游租賃資產 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Upstream leased assets)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 4 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 4)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">組織使用產品</strong>
                      組織承租的資產 (如租用辦公室或設備) 若未列入範疇一/二，則列於此類別的使用排放。
                    </td>
                  </tr>

                  {/* 下游活動 7 項 */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td rowSpan={7} className="p-2 md:p-4 border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 font-bold text-blue-800 dark:text-blue-400 align-middle text-center">
                      下游活動<br className="hidden md:block" />(Downstream)<br /><span className="text-[10px] md:text-xs font-normal text-blue-600 dark:text-blue-500 mt-2 block leading-snug">產品售出後<br />衍生的排放</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.9</span>
                      下游運輸與配送 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Downstream transportation and distribution)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 3 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 3)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">運輸</strong>
                      下游運輸和貨物配送 (產品售出後運送至客戶端的第三方物流運輸)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.10</span>
                      售出產品之加工 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Processing of sold products)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 5)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品</strong>
                      客戶購買企業的半成品後，進一步加工產生的排放。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.11</span>
                      售出產品之使用 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Use of sold products)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 5)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品</strong>
                      產品使用階段 (消費者使用您的產品時所耗用的電力或燃料)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.12</span>
                      售出產品之生命終結處理 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(End-of-life treatment of sold products)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 5)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品</strong>
                      產品最終處理 (產品報廢後的掩埋、焚化或回收處理排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.13</span>
                      下游租賃資產 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Downstream leased assets)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 5)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品</strong>
                      下游租賃資產 (企業身為「出租方」，將資產租給他人使用所產生的排放)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.14</span>
                      特許經營 / 加盟 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Franchises)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5/6
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品 / 其他</strong>
                      依據營運邊界認定，通常為加盟商營運產生的排放 (有時也可歸類為其他)。
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white block">Scope 3.15</span>
                      投資 <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">(Investments)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700 text-center font-bold">
                      類別 5 <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">(Category 5)</span>
                    </td>
                    <td className="p-2 md:p-3 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-800 dark:text-slate-200 block md:mb-1">使用組織產品</strong>
                      投資產生的排放量 (金融業最重視的項目，即「投融資組合」的碳排放 / 範疇三類別 15)。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'sbti' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2"><Target className="w-6 h-6" /> SBTi 考點全面剖析</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">由 CDP、聯合國全球盟約(UNGC)、世界資源研究院(WRI)及世界自然基金會(WWF)於2015年創立，對齊巴黎協定 1.5°C 升溫限制。</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">目標覆蓋率 (Boundary Coverage) 考點</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-purple-700 dark:text-purple-400 mb-1">近期目標 (Near-term) 5~10年</span>
                  <span className="text-slate-600 dark:text-slate-300">Scope 1+2：涵蓋 <strong className="text-red-500 dark:text-red-400">95%</strong> 以上。<br />Scope 3：若占總排放達 40% 以上，則須涵蓋 <strong className="text-red-500 dark:text-red-400">67%</strong> 以上。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-purple-700 dark:text-purple-400 mb-1">淨零目標 (Long-term / Net-Zero) 2050前</span>
                  <span className="text-slate-600 dark:text-slate-300">Scope 1+2+3：均須涵蓋 <strong className="text-red-500 dark:text-red-400">90%</strong> 以上。<br />剩餘排放水準(Residual emissions)至多 <strong className="text-red-500 dark:text-red-400">10%</strong>，才能使用碳權抵換(Neutralization)。</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">中小企業路徑 (SME Route) 考點</h4>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong className="text-purple-700 dark:text-purple-400">定義：</strong>員工數少於 500 人且非 FLAG (林業/農業) 企業。</li>
                <li><strong className="text-purple-700 dark:text-purple-400">優勢：</strong>可直接使用預設系統設定 Scope 1+2 目標，<strong>免除範疇三量化與嚴格審查的初始過程</strong>。</li>
                <li><strong className="text-purple-700 dark:text-purple-400">流程期限：</strong>一般企業從提交承諾書(Commit)到發展目標並提交審查，期限最長為 <strong>24個月</strong>。</li>
              </ul>
            </div>
          </div>

          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">SBTi 參與五大步驟</h4>
          <div className="flex flex-wrap gap-2">
            {['1. 承諾 (Commit)', '2. 準備/發展目標 (Develop)', '3. 提交審核 (Submit)', '4. 溝通 (Communicate)', '5. 每年揭露 (Disclose)'].map((step, idx) => (
              <span key={idx} className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm">{step}</span>
            ))}
          </div>
        </div>
      )}

      {subTab === 're100' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center gap-2"><Sun className="w-6 h-6" /> RE100 再生能源倡議</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">由氣候組織 (The Climate Group) 與 CDP 發起。參與企業承諾在 2050 年前達成 <strong>100% 營運範圍使用再生電力</strong>。</p>

          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">【必考】企業達成 RE100 的三大合法途徑</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-500 rounded-full flex items-center justify-center font-black text-lg mb-3">1</div>
              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">自發自用 (Self-Generation)</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">在廠區屋頂裝設太陽能板，或廠內投資風機等設備，發電後直接供自家工廠營運使用。</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-500 rounded-full flex items-center justify-center font-black text-lg mb-3">2</div>
              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">綠電憑證 (Unbundled RECs)</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">於公開市場購買「再生能源憑證 (T-REC)」，將環境效益與實體電力脫鉤購買。</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-500 rounded-full flex items-center justify-center font-black text-lg mb-3">3</div>
              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">購電協議 (PPAs)</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">企業與綠電發電業或售電業簽署長期購電合約 (Power Purchase Agreement)，直接購買實體綠電與憑證。</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'tcfd' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2"><PieChart className="w-6 h-6" /> TCFD 氣候相關財務揭露</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">由金融穩定委員會 (FSB) 設立。核心目的是將「氣候變遷」視為一種「財務風險」，要求企業向投資人與利害關係人透明揭露氣候變遷對公司財務的潛在影響。</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">兩大氣候風險分類</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-blue-700 dark:text-blue-400 mb-1">實體風險 (Physical Risks)</span>
                  <span className="text-slate-600 dark:text-slate-300">氣候變遷導致的實體災害。分為<strong>立即性</strong>(如颱風、洪水導致廠房淹水停工)與<strong>長期性</strong>(如海平面上升、長期缺水)。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-blue-700 dark:text-blue-400 mb-1">轉型風險 (Transition Risks)</span>
                  <span className="text-slate-600 dark:text-slate-300">邁向低碳社會過程中的衝擊。包含<strong>政策與法規</strong>(如開徵碳費)、<strong>技術</strong>(舊設備被淘汰)、<strong>市場</strong>(客戶要求綠色產品)與<strong>名譽</strong>風險。</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">TCFD 四大核心揭露支柱</h4>
              <ul className="list-disc pl-5 text-sm space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong className="text-blue-700 dark:text-blue-400">治理 (Governance)：</strong>董事會與管理階層在評估、管理氣候風險時的監督責任與角色。</li>
                <li><strong className="text-blue-700 dark:text-blue-400">策略 (Strategy)：</strong>氣候風險與機會對企業營運、策略及財務規劃的實際及潛在影響 (需進行<strong>情境分析 Scenario Analysis</strong>)。</li>
                <li><strong className="text-blue-700 dark:text-blue-400">風險管理 (Risk Management)：</strong>企業如何辨識、評估與管理氣候相關風險，並整合進既有風險管理制度中。</li>
                <li><strong className="text-blue-700 dark:text-blue-400">指標與目標 (Metrics & Targets)：</strong>評估與管理氣候風險的指標，以及企業設定的減量目標與達成狀況 (須揭露 Scope 1, 2, 3)。</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'sasb' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-400 mb-4 flex items-center gap-2"><FileText className="w-6 h-6" /> SASB 永續會計準則</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            由永續會計準則委員會 (SASB) 發布。核心目的是為<strong>投資人與資本市場</strong>提供具備「財務重大性」且「具可比較性」的 ESG 資訊，協助評估企業的長期財務價值。
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">三大核心特色 (考點)</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-indigo-700 dark:text-indigo-400 mb-1">1. 財務重大性 (Financial Materiality)</span>
                  <span className="text-slate-600 dark:text-slate-300">只關注那些極有可能會影響企業財務狀況、營運績效與現金流的永續議題（由外而內的影響）。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-indigo-700 dark:text-indigo-400 mb-1">2. 行業特定 (Industry-Specific)</span>
                  <span className="text-slate-600 dark:text-slate-300">建立永續產業分類系統 (SICS)，將企業分為 11 個主行業、77 個子行業。針對各行業量身打造專屬的揭露指標（如：科技業看重能耗，金融業看重資安）。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-indigo-700 dark:text-indigo-400 mb-1">3. 決策有用性 (Decision-Useful)</span>
                  <span className="text-slate-600 dark:text-slate-300">為投資人提供具體、可量化的標準化指標，方便資本市場在同業競爭對手之間進行精準的標竿比較。</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">GRI 與 SASB 的比較與整合</h4>
              <ul className="list-disc pl-5 text-sm space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong className="text-indigo-700 dark:text-indigo-400">GRI (全面性)：</strong>關注企業營運對經濟、環境、社會人群造成的「外部衝擊」。受眾是所有利害關係人。</li>
                <li><strong className="text-indigo-700 dark:text-indigo-400">SASB (聚焦性)：</strong>關注外部 ESG 議題對企業創造價值的「內部財務影響」。受眾聚焦於投資人。</li>
                <li><strong className="text-indigo-700 dark:text-indigo-400">雙重重大性 (Double Materiality)：</strong>現今實務主流要求企業將 GRI 與 SASB 結合使用，同時揭露「環境社會衝擊」與「財務影響」雙面向議題。</li>
                <li><strong className="text-indigo-700 dark:text-indigo-400">現況發展 (ISSB 整併)：</strong>SASB 準則目前已被整併入 IFRS 基金會轄下的國際永續準則委員會 (ISSB)，並成為發布 IFRS S1 與 S2 全球基準的重要基石。</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'pact' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-400 mb-4 flex items-center gap-2"><Network className="w-6 h-6" /> PACT 碳透明度夥伴關係</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30">由 WBCSD (世界企業永續發展委員會) 發起。核心目標是為了解決企業在計算「範疇三 (Scope 3)」時，面臨供應鏈數據不透明、格式不一、難以串接的痛點。</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">解決的核心痛點</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-teal-700 dark:text-teal-400 mb-1">擺脫「次級數據 (次級資料)」</span>
                  <span className="text-slate-600 dark:text-slate-300">過去企業計算 Scope 3 多依賴產業平均資料庫(如 Ecoinvent)。PACT 致力於讓供應鏈上下游能安全地交換<strong>真實的初級數據 (Primary Data)</strong>，讓減碳績效能被真實反映。</span>
                </li>
                <li className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="font-black text-teal-700 dark:text-teal-400 mb-1">跨平台的數據互通性</span>
                  <span className="text-slate-600 dark:text-slate-300">不同企業使用不同的碳管理軟體。PACT 建立了統一的 API 標準，讓系統 A 可以直接與系統 B 溝通並傳輸碳足跡資料。</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">Pathfinder Framework (探路者框架)</h4>
              <ul className="list-disc pl-5 text-sm space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong className="text-teal-700 dark:text-teal-400">標準化的 PCF 計算：</strong>基於 ISO 14067 與 GHG Protocol，制定了更具體、更適用於跨產業交換的「產品碳足跡 (Product Carbon Footprint)」計算指引。</li>
                <li><strong className="text-teal-700 dark:text-teal-400">資料交換技術協定：</strong>定義了數據的技術交換格式，確保在共享排放資料時，企業的商業機密(如供應商名單、BOM表)能得到保護。</li>
                <li><strong className="text-teal-700 dark:text-teal-400">推動生態系整合：</strong>與國際大廠及軟體巨頭(如 SAP, Microsoft)合作，將其標準內建於主流 ERP 與碳管理系統中。</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === 'guide' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">《淨零實踐指南》7大步驟地圖</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { name: '準備', icon: <Target size={20} />, desc: '啟動淨零之旅' },
              { name: '衡量', icon: <Search size={20} />, desc: '盤查溫室氣體' },
              { name: '設定目標', icon: <ArrowRight size={20} />, desc: '務實且具意義' },
              { name: '減量', icon: <Wind size={20} />, desc: '排定優先順序' },
              { name: '報導', icon: <BookOpen size={20} />, desc: '氣候風險揭露' },
              { name: '超越', icon: <Globe size={20} />, desc: '價值鏈外行動' },
              { name: '調適', icon: <ShieldCheck size={20} />, desc: '建立實體韌性' }
            ].map((step, idx) => (
              <Fragment key={idx}>
                <div className="flex flex-col items-center group w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-purple-100 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:border-purple-500 dark:group-hover:border-purple-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-all shadow-sm">
                    {step.icon}
                  </div>
                  <span className="text-md font-black text-slate-800 dark:text-slate-200">{step.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 hidden md:block text-center">{step.desc}</span>
                </div>
                {idx < 6 && (
                  <div className="hidden md:block flex-1 h-1 bg-slate-200 dark:bg-slate-700 w-full rounded-full relative"></div>
                )}
                {idx < 6 && (
                  <div className="md:hidden w-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full my-1"></div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// --- 單元四：金融與碳定價 ---

const Section4 = () => {
  const [subTab, setSubTab] = useState('pricing');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <CircleDollarSign className="text-orange-500 dark:text-orange-400 w-8 h-8" />
          單元四：永續金融與碳市場機制
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">必考重點：綠色金融原則(PRI/PRB/EPs)、碳定價(稅/費/ETS)、碳抵換</p>
      </header>

      <SubTabs
        tabs={[
          { id: 'pricing', label: '碳定價與碳關稅' },
          { id: 'credits', label: '碳交易與碳抵換機制' },
          { id: 'icp', label: '內部碳定價 (ICP)' },
          { id: 'finance', label: '永續金融與倡議' }
        ]}
        activeTab={subTab}
        setActiveTab={setSubTab}
      />

      {subTab === 'pricing' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">國際碳定價機制必考差異</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-900/50">
              <div className="flex justify-between items-start mb-4 border-b border-orange-200 dark:border-orange-800/50 pb-3">
                <span className="font-black text-orange-900 dark:text-orange-400 text-xl">碳稅 / 碳費 (Carbon Tax/Fee)</span>
                <span className="text-sm font-bold px-3 py-1 bg-orange-600 dark:bg-orange-500 text-white rounded-full">價格確定</span>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                <li>由政府公權力訂定每噸碳的排放價格（如：台灣首波碳費）。</li>
                <li>企業排多少碳，就繳多少費。</li>
                <li><strong>缺點：</strong>減碳的「總量效果」較難精確預估，政府需動態調升費率以逼迫企業減碳。</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-900/50">
              <div className="flex justify-between items-start mb-4 border-b border-blue-200 dark:border-blue-800/50 pb-3">
                <span className="font-black text-blue-900 dark:text-blue-400 text-xl">總量管制與交易 (ETS)</span>
                <span className="text-sm font-bold px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded-full">總量確定</span>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                <li>政府設定排放總量上限 (Cap)，並核發或拍賣排放許可。</li>
                <li>企業可透過市場買賣碳權 (Trade)。若排碳超過額度必須去市場買；減碳有成則可賣出牟利。</li>
                <li><strong>特點：</strong>價格由市場供需決定，但能確保國家總減量目標達成。</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl text-white border-l-8 border-orange-500 dark:border-orange-400">
            <h4 className="text-lg font-bold mb-2 flex items-center gap-2 text-orange-400 dark:text-orange-300">考點：歐盟碳邊境調整機制 (CBAM)</h4>
            <p className="text-slate-300 dark:text-slate-400 text-sm leading-relaxed">
              針對進口的高碳排產品徵收碳關稅，目的是防止<strong>「碳洩漏」(Carbon Leakage)</strong>（企業為躲避國內高昂碳價，將工廠外移至無碳管制國家的行為）。初期管制：鋼鐵、水泥、鋁、化肥、電力及氫氣。
            </p>
          </div>
        </div>
      )}

      {subTab === 'credits' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">碳權 (Carbon Credits) 的來源與分類</h3>

          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">名詞辨析：Allowance vs. Credit</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="block font-black text-blue-700 dark:text-blue-400 text-lg mb-1">核配額度 (Allowance)</span>
                <p className="text-slate-600 dark:text-slate-400">來自於強制性的「總量管制 (ETS)」，是政府給你的「排碳許可」。</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="block font-black text-emerald-700 dark:text-emerald-400 text-lg mb-1">信用額度 (Credit)</span>
                <p className="text-slate-600 dark:text-slate-400">來自於自願減量專案（如造林、蓋風機）。是你主動減碳生出來的「抵換額度 (Offset)」。</p>
              </div>
            </div>
          </div>

          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">三大減量認可機制</h4>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded font-bold h-fit whitespace-nowrap">聯合國機制</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 pt-1">如清潔發展機制(CDM)及巴黎協定第6條的 ITMOs。提供國家間轉移減量成果的最高層級機制。</p>
            </div>
            <div className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded font-bold h-fit whitespace-nowrap">政府機制</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 pt-1">由國家政府制定，如台灣環境部的「自願減量專案」，可產生本國承認的減量額度供國內企業抵換。</p>
            </div>
            <div className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-orange-50 dark:bg-orange-900/10">
              <div className="bg-orange-200 dark:bg-orange-900/50 text-orange-900 dark:text-orange-300 px-3 py-1 rounded font-bold h-fit whitespace-nowrap">獨立機構機制</div>
              <div className="text-sm text-slate-700 dark:text-slate-300 pt-1">
                自願性碳市場(VCM)的主力。考試必考兩大標準：
                <ul className="list-disc pl-5 mt-2 font-medium">
                  <li className="text-orange-800 dark:text-orange-400">Verra (VCS)：全球發行量最大。</li>
                  <li className="text-orange-800 dark:text-orange-400">黃金標準 (Gold Standard, GS)：強調專案必須對應聯合國永續發展目標(SDGs)及嚴格的<strong className="bg-orange-200 dark:bg-orange-900/50 px-1 rounded">社會保障原則</strong>（如人權、水資源、當地社區健康）。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'icp' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2"><Droplets className="text-teal-500 dark:text-teal-400" /> 內部碳定價 (Internal Carbon Pricing)</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30">將氣候風險轉化為財務語言，強迫各部門在進行投資決策時將排碳成本納入考量，從而驅動企業低碳轉型。</p>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-center">
              <div className="w-10 h-10 mx-auto bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center font-black text-lg mb-3">1</div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">標的</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">決定定價適用範圍，是僅限範疇一/二，還是包含出差等範疇三。</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-center">
              <div className="w-10 h-10 mx-auto bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center font-black text-lg mb-3">2</div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">影響</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">決定是虛擬計算的「影子價格」還是真正扣部門預算的「實質收費」。</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-center">
              <div className="w-10 h-10 mx-auto bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center font-black text-lg mb-3">3</div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">發展</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">價格隨時間推移的軌跡（靜態定價 vs 隨政策法規動態遞增）。</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-center">
              <div className="w-10 h-10 mx-auto bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center font-black text-lg mb-3">4</div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">應用</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">將碳價用於評估資本支出投報率(ROI)、或納入高階主管績效考核。</p>
            </div>
          </div>
        </div>
      )}

      {subTab === 'finance' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2"><Landmark className="text-blue-600 dark:text-blue-400" /> 國際永續金融倡議與規範</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <strong>核心觀念：</strong>金融業在淨零轉型中扮演「資金引導」的關鍵角色。透過投融資的影響力（對應 GHG Protocol 範疇三第 15 類：投資），運用資金成本的壓力，引導實體企業落實減碳與 ESG 轉型。
          </p>

          <div className="space-y-8">
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h4 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">聯合國三大永續金融原則 (必考區別)</h4>
              <div className="grid md:grid-cols-3 gap-5 text-sm">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <span className="block font-black text-blue-800 dark:text-blue-400 text-lg mb-1">PRI 責任投資原則</span>
                  <p className="text-blue-600 dark:text-blue-300 font-bold mb-3 bg-blue-50 dark:bg-blue-900/30 py-1 px-2 rounded w-fit">針對：機構投資人</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">2005年發起。要求將 ESG 議題納入投資分析與決策過程，並作為積極的所有權人（Shareholder），要求被投資企業揭露 ESG 資訊。</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                  <span className="block font-black text-purple-800 dark:text-purple-400 text-lg mb-1">PSI 永續保險原則</span>
                  <p className="text-purple-600 dark:text-purple-300 font-bold mb-3 bg-purple-50 dark:bg-purple-900/30 py-1 px-2 rounded w-fit">針對：保險業</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">2012年發起。將 ESG 議題融入保險業的核心業務（包含風險管理、核保業務及產品開發），以降低氣候災難風險並開發綠色保險產品。</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
                  <span className="block font-black text-emerald-800 dark:text-emerald-400 text-lg mb-1">PRB 責任銀行原則</span>
                  <p className="text-emerald-600 dark:text-emerald-300 font-bold mb-3 bg-emerald-50 dark:bg-emerald-900/30 py-1 px-2 rounded w-fit">針對：銀行業</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">2019年發起。確保銀行的商業策略與聯合國 SDGs 及《巴黎協定》目標保持一致，將授信與貸款業務導向低碳永續發展的領域。</p>
                </div>
              </div>
            </div>

            <div className="border-l-8 border-orange-500 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/10 p-6 rounded-r-2xl border-y border-r border-orange-200 dark:border-orange-900/30 shadow-sm">
              <h4 className="font-black text-xl text-orange-900 dark:text-orange-400 mb-3 flex items-center gap-2">赤道原則 (Equator Principles, EPs)</h4>
              <p className="text-orange-800 dark:text-orange-300 font-bold text-sm mb-3">關鍵字：大型專案融資 (Project Finance)、自願性指引</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">
                赤道原則是一套由金融機構自願簽署採用的風險管理框架。主要是為了確保<strong>大型開發專案（如：建設發電廠、水壩、採礦、交通基建）</strong>在發展的同時，能夠對環境與社會負責。
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50">
                <strong>實務運作：</strong>金融機構（赤道銀行）承諾在融資前，必須對該專案進行嚴格的環境與社會影響評估。若借款人無法遵守赤道原則的規範（例如破壞當地生態保護區、嚴重影響原住民與當地社區人權等），銀行將會<strong>拒絕提供融資</strong>。
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Dashboard = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header className="mb-8 text-center border-b border-slate-200 dark:border-slate-800 pb-6">
      <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">臺灣 2050 淨零轉型看板</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">考前必背：四大策略、兩大基礎與十二項關鍵戰略</p>
    </header>

    <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-20 -mt-20 z-0"></div>

      <div className="relative z-10">
        <h3 className="text-center font-black text-2xl text-emerald-900 dark:text-emerald-400 mb-8 tracking-widest pb-4 border-b-2 border-emerald-100 dark:border-emerald-800/50 inline-block w-full">四大轉型策略</h3>
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { title: '能源轉型', icon: <Zap size={32} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/50', text: '極大化再生能源、氫能開發' },
            { title: '產業轉型', icon: <Building2 size={32} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/50', text: '製程改善、循環經濟零廢棄' },
            { title: '生活轉型', icon: <Leaf size={32} />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800/50', text: '綠色運輸、低碳建築與飲食' },
            { title: '社會轉型', icon: <Globe size={32} />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800/50', text: '公正轉型、公民參與對話' },
          ].map((item, idx) => (
            <div key={idx} className={`${item.bg} ${item.border} border-2 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 transition-transform`}>
              <div className={`${item.color} mb-3 bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm`}>{item.icon}</div>
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-xl mb-2">{item.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 mb-12 shadow-inner">
          <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-6 text-center">十二項關鍵戰略</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {['風電/光電', '氫能', '前瞻能源', '電力系統與儲能', '節能', '碳捕捉利用及封存(CCUS)', '運具電動化及無碳化', '資源循環零廢棄', '自然碳匯', '淨零綠生活', '綠色金融', '公正轉型'].map((strat, i) => (
              <span key={i} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-default transition-colors">
                {i + 1}. {strat}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-center font-black text-2xl text-slate-800 dark:text-slate-100 mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block w-full">兩大治理基礎</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 p-8 rounded-3xl text-white text-center shadow-lg border border-slate-600 dark:border-slate-700">
            <h4 className="font-black text-2xl mb-3 text-emerald-300">科技研發</h4>
            <p className="text-slate-300 dark:text-slate-400">發展淨零科技、負碳技術(CCUS)、前瞻綠能基礎建設</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-700 dark:from-emerald-900 dark:to-emerald-800 p-8 rounded-3xl text-white text-center shadow-lg border border-emerald-600 dark:border-emerald-700">
            <h4 className="font-black text-2xl mb-3 text-orange-300">氣候法制</h4>
            <p className="text-emerald-100 dark:text-emerald-200">氣候變遷因應法、碳費徵收與查驗機制、外部成本內部化</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dictionary.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 text-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">永續備考辭典</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">快速查找並熟記考場核心專有名詞與陷阱題</p>
      </header>

      <div className="relative max-w-2xl mx-auto mb-10">
        <Search className="absolute left-5 top-4 text-emerald-600 dark:text-emerald-500 w-6 h-6" />
        <input
          type="text"
          placeholder="搜尋關鍵字 (例如: Scope, CBAM, GWP...)"
          className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none text-lg shadow-sm transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3">{item.term}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">{item.desc}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center text-slate-500 dark:text-slate-400 py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-600">
            <Search className="mx-auto text-slate-300 dark:text-slate-500 w-12 h-12 mb-4" />
            <p className="text-lg">辭典內目前無此名詞，請嘗試其他關鍵字。</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  batch: string;
}

// 解析 CSV 的 Helper 函式 (已升級為全自動偵測分隔符號，並統一解答判斷邏輯)
const parseCSVtoQuizzes = (csvText: string): QuizQuestion[] => {
  if (!csvText || typeof csvText !== 'string') return [];

  // 自動偵測分隔符號 (判斷第一行出現的逗號與分號次數)
  const firstLine = csvText.split(/\r?\n/)[0] || '';
  const commas = (firstLine.match(/,/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;
  const delimiter = semicolons > commas ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // 更穩健的 CSV 解析器，支援儲存格內包含分隔符與換行符號
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // 跳過下一個引號
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      currentRow.push(currentCell);
      // 過濾掉全空的列
      if (currentRow.some(cell => cell.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++; // 跳過 \n
    } else {
      currentCell += char;
    }
  }
  if (currentRow.length > 0 || currentCell) {
    currentRow.push(currentCell);
    if (currentRow.some(cell => cell.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // 移除 BOM (Byte Order Mark) 以確保標題列比對正確
  const headers: string[] = rows[0].map(h =>
    h.trim().toLowerCase().replace(/^\uFEFF/, '')
  );

  const rawJson = rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      // 確保即使列長度不符也不會出錯
      obj[header] = (row[index] || '').trim();
    });
    return obj;
  });

  return rawJson
    .map((row: Record<string, string>): QuizQuestion => {
      const q = row['question'] || row['題目'] || row['問題'] || '';
      const exp = row['explanation'] || row['解析'] || row['解答'] || row['說明'] || '';

      // 解析 batch 欄位 (支援多種常見命名)
      const batchRaw = String(row['batch'] || row['batch#'] || row['批次'] || row['分類'] || '').trim();
      const batchName = batchRaw || '未分類題庫';

      let options: string[] = [];
      // 根據新的 prompt 格式，優先找尋 option_0, option_1, option_2, option_3
      const o0 = row['option_0'] || row['option1'] || row['選項a'] || row['選項1'] || '';
      const o1 = row['option_1'] || row['option2'] || row['選項b'] || row['選項2'] || '';
      const o2 = row['option_2'] || row['option3'] || row['選項c'] || row['選項3'] || '';
      const o3 = row['option_3'] || row['option4'] || row['選項d'] || row['選項4'] || '';

      if (o0 || o1 || o2 || o3) {
        options = [o0, o1, o2, o3].filter(Boolean); // 過濾掉空字串
      } else {
        // Fallback: 尋找任何包含 option 或 選項 的欄位
        const optKeys = Object.keys(row).filter(k => k.includes('option') || k.includes('選項'));
        optKeys.sort();
        options = optKeys.map(k => row[k]).filter(Boolean);
      }

      let ansIndex = 0;
      // 擴大 answer 的容錯解析 (支援 answer, 答案, 解答 等欄位名稱)
      const ansRaw = String(row['answer'] || row['答案'] || row['解答選項'] || row['解答'] || '').trim();
      const ansRawUpper = ansRaw.toUpperCase();

      // 判斷正確解答索引邏輯
      if (/^[A-D]$/.test(ansRawUpper)) {
        // 處理 A, B, C, D 轉為 0, 1, 2, 3
        ansIndex = ansRawUpper.charCodeAt(0) - 65;
      } else if (options.findIndex(opt => opt.trim() === ansRaw) !== -1) {
        // 如果 CSV 的解答直接填寫選項的完整字串，透過比對找出正確索引
        ansIndex = options.findIndex(opt => opt.trim() === ansRaw);
      } else {
        // 若為數字 (配合 prompt 提示：0=A, 1=B, 2=C, 3=D)
        const parsedNum = parseInt(ansRaw, 10);
        if (!isNaN(parsedNum)) {
          ansIndex = parsedNum;
        }
      }

      // 最後防護：確保索引不會超出範圍
      if (ansIndex < 0 || ansIndex >= options.length) {
        ansIndex = 0;
      }
      return {
        question: q,
        options: options.length >= 2 ? options : ['(無效的選項)'],
        answer: ansIndex,
        explanation: exp,
        batch: batchName // 加入 batch 資訊
      };
    })
    .filter((q: QuizQuestion) => q.question); // 過濾掉沒有題目的空資料
};

const QuizzesPage = () => {
  const [apiQuizzes, setApiQuizzes] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Batch 題庫切換狀態 (預設值為空，將在資料載入後動態設定)
  const [selectedBatch, setSelectedBatch] = useState('');

  // 成績與錯題追蹤
  const [answersStatus, setAnswersStatus] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);

  // 串接 Google Sheet CSV 雲端題庫
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCPGxbKogw93V9PBXklJgsA35TXFMbC8aRd5hwAf4KsIaCdN0F4mvLlybMB6Q-7dx04DWUbAjKzR2E/pub?output=csv';
        // Google Sheets 發布為 CSV 時，預設允許跨來源請求 (CORS)，直接讀取即可
        const response = await fetch(csvUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const csvText = await response.text();
        const formattedQuizzes = parseCSVtoQuizzes(csvText);

        setApiQuizzes(formattedQuizzes);

        // 載入資料後，設定預設的 Batch
        if (formattedQuizzes.length > 0) {
          const batches = Array.from(new Set(formattedQuizzes.map(q => q.batch)));
          // 若有 batch#1 則優先選取，否則選取第一個可用的分類
          if (batches.includes('batch#1')) {
            setSelectedBatch('batch#1');
          } else {
            setSelectedBatch(batches[0]);
          }
        }

      } catch (error) {
        console.error("Fetch API Error:", error);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // 衍生狀態：取得所有不重複的 Batch 名稱 (移除 "全部" 選項)
  const uniqueBatches: string[] = Array.from(
    new Set(apiQuizzes.map(q => q.batch))
  ).sort();

  // 衍生狀態：根據當前選擇的 Batch 過濾題目
  const filteredQuizzes = apiQuizzes.filter(q => q.batch === selectedBatch);

// 切換 Batch 時，重置作答狀態與成績視窗
const handleBatchChange = (batch: string) => {
  setSelectedBatch(batch);
  setAnswersStatus({});
  setShowResult(false);
};

// 使用者作答
const handleAnswerSubmit = (
  qIndex: number,
  isCorrect: boolean
) => {
  setAnswersStatus(prev => ({
    ...prev,
    [qIndex]: isCorrect,
  }));
};

  // 注意：這裡的所有計算都基於「當前過濾後的題庫 (filteredQuizzes)」
  const totalAnswered = Object.keys(answersStatus).length;
  const isAllAnswered = filteredQuizzes.length > 0 && totalAnswered === filteredQuizzes.length;

  const calculateScore = () => {
    if (filteredQuizzes.length === 0) return 0;
    const correctCount = Object.values(answersStatus).filter(Boolean).length;
    return Math.round((correctCount / filteredQuizzes.length) * 100);
  };

  const getIncorrectQuestions = () => {
    return filteredQuizzes.filter((_, idx) => answersStatus[idx] === false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <header className="mb-8 text-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">考前實戰測驗</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">檢驗學習成效，掌握各單元必考重點與陷阱題</p>
      </header>

      {/* 題庫 (Batch) 切換按鈕區塊 */}
      {!isLoading && !fetchError && uniqueBatches.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {uniqueBatches.map(batch => (
            <button
              key={batch}
              onClick={() => handleBatchChange(batch)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${selectedBatch === batch
                  ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
            >
              {batch}
            </button>
          ))}
        </div>
      )}

      {/* 浮動成績結算按鈕 (取代原本佔空間的頂部進度條) */}
      {!isLoading && !fetchError && filteredQuizzes.length > 0 && (
        <button
          onClick={() => setShowResult(true)}
          disabled={totalAnswered === 0}
          className="fixed bottom-24 right-5 md:bottom-10 md:right-10 z-[60] flex items-center gap-3 bg-blue-600 dark:bg-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white px-5 py-3 md:px-6 md:py-3.5 rounded-full shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] disabled:shadow-none transition-all hover:-translate-y-1 active:scale-95 group"
          title="結算成績與檢視錯題"
        >
          <div className="relative flex items-center justify-center">
            {/* 動態圓形進度環 */}
            <svg className="w-6 h-6 md:w-7 md:h-7 transform -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="transparent" className="opacity-20" />
              <circle
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="62.8"
                strokeDashoffset={62.8 - (62.8 * (totalAnswered / filteredQuizzes.length))}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start leading-tight text-left">
            <span className="font-black text-sm md:text-base">結算成績</span>
            <span className="text-[10px] md:text-xs opacity-90 font-bold">{totalAnswered} / {filteredQuizzes.length} 題已答</span>
          </div>
        </button>
      )}

      <div className="space-y-6">
        {/* 雲端 API 載入狀態 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold">正在從雲端題庫同步最新考題...</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-900/50">
            <AlertTriangle className="mx-auto text-red-500 w-12 h-12 mb-3" />
            <p className="text-red-700 dark:text-red-400 font-bold">無法載入雲端題庫，請確認 CSV 網址是否正確發佈。</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 shadow-sm">
            <ClipboardCheck className="mx-auto text-slate-300 dark:text-slate-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">此分類尚無測驗題</h3>
            <p className="text-slate-500 dark:text-slate-400">雲端題庫目前為空，請在 Google Sheet 中新增考題！</p>
          </div>
        ) : (
          <>
            {filteredQuizzes.map((q, idx) => (
              <QuizModule
                key={`${selectedBatch}-${idx}`}
                quizData={q}
                unitTitle={`【${q.batch}】 第 ${idx + 1} 題`}
                qIndex={idx}
                onAnswer={handleAnswerSubmit}
              />
            ))}
          </>
        )}
      </div>

      {/* 結算結果 Modal */}
      {showResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-6 md:p-8 text-center border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">測驗成績結算</h2>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">總得分</p>
                  <p className={`text-5xl font-black ${calculateScore() >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {calculateScore()}
                  </p>
                </div>
                <div className="h-12 w-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">完成率</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {Math.round((totalAnswered / filteredQuizzes.length) * 100)}%
                  </p>
                </div>
              </div>
              {!isAllAnswered && (
                <p className="text-sm text-orange-500 font-bold mt-4">⚠️ 您還有 {filteredQuizzes.length - totalAnswered} 題尚未作答，成績僅供參考。</p>
              )}
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BookOpen className="text-red-500 w-6 h-6" /> 錯題分析與複習 ({getIncorrectQuestions().length} 題)
              </h3>

              {getIncorrectQuestions().length === 0 ? (
                <div className="text-center py-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 className="mx-auto w-12 h-12 text-emerald-500 mb-2" />
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">太棒了！您目前的作答完全正確，請繼續保持！</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getIncorrectQuestions().map((q, idx) => (
                    <div key={idx} className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
                      <p className="font-bold text-slate-800 dark:text-slate-100 mb-3">{q.question}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 p-2 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                          <div><span className="font-bold">正確答案：</span> {q.options[q.answer]}</div>
                        </div>
                        <div className="mt-3 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-800 dark:text-slate-200">📌 解析：</span> {q.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setShowResult(false)}
                className="px-6 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-white transition-colors"
              >
                關閉並繼續測驗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 展開/隱藏 擴充工具按鈕 */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm"
        >
          {showImport ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {showImport ? '隱藏題庫擴充工具' : '展開題庫擴充工具 (指令與雲端連結)'}
        </button>
      </div>

      {/* 隱藏/展開的擴充區塊 (條件渲染) */}
      {showImport && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 duration-300">

          {/* NotebookLM 提示詞區塊 */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Code className="text-emerald-600 dark:text-emerald-400" /> NotebookLM 題庫生成指令
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              請複製下方提示詞至 NotebookLM 產生新考題，並將結果貼入下方的 Google Sheet 題庫中。重新整理本網頁即可載入新題庫！
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <code className="text-sm text-emerald-800 dark:text-emerald-300 select-all block bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/50 font-mono overflow-x-auto whitespace-pre-wrap">
                請根據來源的文件，幫我出 50 題中難度的選擇題，必須不同於之前的考題。請嚴格遵守以下輸出格式要求：<br /><br />
                格式類型：請以 CSV 純文字 格式輸出，每一題必須獨立成行（必須有換行符號）。欄位之間請使用 分號 ( ; ) 分隔。<br />
                欄位順序：請嚴格遵守以下順序：question;option_0;option_1;option_2;option_3;answer;explanation<br />
                內容限制：<br />
                禁止 加上任何 Markdown 標記（如 ``` 或表格符號）。<br />
                禁止 出現任何斷行或換行符號，每一題必須完整佔用且僅佔用一行。<br />
                禁止 輸出任何前言或結語（例如「以下是為您準備的題目...」）。<br />
                標點符號：題目或解析中若有逗號請保留，但絕對不可出現分號 ( ; )，若內容有分號請改用全形「；」。<br />
                欄位內容：<br />
                answer：請提供正確答案的索引數字（0 代表第一個選項，1 代表第二個，依此類推）。<br />
                explanation：請提供簡短精確的解析。<br />
                請直接開始輸出這 50 題，並轉換為標準的 CSV 檔案格式
              </code>
            </div>
          </div>

          {/* 雲端題庫連結獨立區塊 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 md:p-8 rounded-3xl shadow-sm border border-blue-200 dark:border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                <FileText className="text-blue-600 dark:text-blue-400" /> 雲端題庫來源
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                本系統的預設測驗題庫同步自公開的 Google Sheet。點擊按鈕開啟表單，將 NotebookLM 產生的 CSV 內容貼入其中，即可全域更新本系統的測驗內容。
              </p>
            </div>
            <a
              href="https://docs.google.com/spreadsheets/d/1GCZzVzDr4Ne8qLdXjh23H_-smpM125GxmjzXOK1zu2A/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <Globe size={18} />
              開啟 Google Sheet
            </a>
          </div>

        </div>
      )}
    </div>
  );
};

// --- 主應用程序 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('sec1');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const navItems = [
    { id: 'sec1', icon: <Globe size={20} />, label: '政策與法規' },
    { id: 'sec2', icon: <CheckCircle2 size={20} />, label: 'ISO與盤查' },
    { id: 'sec3', icon: <Map size={20} />, label: '氣候治理' },
    { id: 'sec4', icon: <CircleDollarSign size={20} />, label: '金融與碳權' },
    { id: 'dashboard', icon: <Target size={20} />, label: '台灣淨零' },
    { id: 'dict', icon: <BookOpen size={20} />, label: '必備辭典' },
    { id: 'quizzes', icon: <ClipboardCheck size={20} />, label: '實戰測驗' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">

      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:py-5 relative">

          <div className="absolute right-4 top-3 lg:top-5 z-10">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm"
              aria-label="切換深色模式"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-400 font-black text-xl lg:text-2xl tracking-wide pr-12 lg:pr-0">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg"><Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 dark:text-emerald-400 fill-current" /></div>
            <span className="hidden sm:inline">淨零碳規劃管理</span>
            <span className="sm:hidden">淨零碳規劃</span>
          </div>

          <div className="hidden lg:flex justify-center flex-wrap gap-2 mt-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex overflow-x-auto z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] hide-scrollbar transition-colors duration-300">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 min-w-[75px] py-4 px-1 flex flex-col items-center justify-center gap-1.5 text-[10px] font-black transition-colors ${activeTab === item.id
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            {item.icon}
            <span className="truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 py-8 md:py-12">
        {activeTab === 'sec1' && <Section1 />}
        {activeTab === 'sec2' && <Section2 />}
        {activeTab === 'sec3' && <Section3 />}
        {activeTab === 'sec4' && <Section4 />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'dict' && <Dictionary />}
        {activeTab === 'quizzes' && <QuizzesPage />}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
    </div>
  );
}