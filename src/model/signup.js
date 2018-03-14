if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function check_username(username) {
    const where = username ? `WHERE username = '$1:value'` : '';
    const sql = `
        SELECT *
        FROM Users
        ${where}
    `;
    return db.any(sql, [username]);
}

function create_account(username, email, password, passportnumber) {
    const about_me = "Hi，親愛的朋友，我是旅行者，我喜歡旅行。 因此，我深深地體會到，在旅行中行李超重是件如此麻煩的事，所以我想為您提供一個舒適的地方來參觀我的賓館，歡迎來到台中。";
    const rule_1 = "\t\t\t\t\t\t\t\t\t\t\t\t第一條 本託運條款於託運人將其貨品委託Tom Perrin（以下簡稱運送人）辦理行李託運業務時適用之，託運人並同意以下各條款之約定。" +
        "第二條 託運人於託運貨品時，應依託運單之內容詳實填載，若有疑義或資訊不明者，運送人得檢驗之。 託運單之填寫如有虛偽不實者，運送人不負任何運送損害賠償責任。\n\t\t\t\t\t\t\t\t\t\t\t\t第三條 託運人應按貨品之性質、重量、容積等，做妥適之包裝，並放入Sparbag(本平台指定之專用行李箱)，違者，運送人得拒收及拒絕託運，但其費用由託運人負擔。 第四條 若託運人故意或過失有下列第一款至第六款所列或有第八款所列之情況發生時，運送人得拒絕受理託運業務：\n\t\t\t\t\t\t\t\t\t\t\t\t第一款. 不合本託運條款規定之委託申請。 第二款. 託運人未按規定填寫託運單者、託運單未詳實填寫完全。 第三款. 未按貨品之性質、重量、容積等做妥適之包裝者。 第四款. 託運人要求額外之" +
        "負擔者。 第五款. 行李之託運違反法令規章者（含各國相關法令及各家航空公司所訂定之行李運輸條款）。\n\t\t\t\t\t\t\t\t\t\t\t\t第六款. 貨品為下列物品時： 1. 槍炮彈藥刀劍類等危險、違禁物品(含所有法令規定之危險物品及禁運品)。 2. 運送人特別規定拒絕受理之貨品，如下： 依貨物性質區分：　 ‧ 現金、票據、股票等有價證券或珠寶、古董、藝術\n\t\t\t\t\t\t\t\t\t\t\t\t品、貴金屬等貴重物。 ‧ 信用卡、提款卡、標單或類似物品。‧ 遺骨、牌位、佛像等。 ‧ 動物類：狗、貓、小鳥等。 ‧\n\t\t\t\t\t\t\t\t\t\t\t\t證件類:諸如准考證、護照、機票類等。 ‧ 不能再複製之圖、稿、卡帶、磁碟或其他同性質物品等。 ‧ 煙火、油品、瓦斯瓶、稀釋劑等易燃、揮發、腐蝕性物品。 ‧" +
        "有毒性物品。\n\t\t\t\t\t\t\t\t\t\t\t\t‧ 具危險性或有違公共秩序、善良風俗等之物品。 ‧ 其他經運送人認定無法受理之物品。 依貨物價格區分： ‧ 託運貨品價值超過新台幣貳萬元者。 第七款. 天災地變或不可抗力之情事發生時。\n\t\t\t\t\t\t\t\t\t\t\t\t第八款. 航空公司託運相關規定 第五條 在確保運送品質之前提下，託運人同意運送人所受理之貨品得交由運送人以外之其他單位或業者運送，惟運送人仍應依本條款擔負運送上之責任。 第六條 託運人同意以下列規定之人為所認可之交付對象：\n\t\t\t\t\t\t\t\t\t\t\t\t1.Sparbag所歸屬的Sparstation 第七條 1.運送人於無法確認收件人之身份或收件人（含第六條之對象）拒絕收受或有其他理由無法收受時，於不負遲延及保管責任之前提下得要求託運人在相當期間內對貨品做處置指示，違者運送人得按貨品之性質逕為處置或將貨品退還託運人。\n\t\t\t\t\t\t\t\t\t\t\t\t2.有關依本條規定處置所生之費用應由託運人負擔。" +
        "第八條 1.運送人於運送中得知貨品為第四條之物品時，為防止其運送上之損失，得即刻進行卸貨處置，其所需之費用應由託運人負擔。 2.任何因前項所載貨品、託運單未詳實填寫完全或託運單之填寫虛偽不實所致之損害及責任(含但不限於託運人託運之貨品致運送人遭政府機關裁處之處分、罰鍰)，託運人應負完全賠償責任。\n\t\t\t\t\t\t\t\t\t\t\t\t第九條 運送人於下列事由所引起貨品之遺失、毀損、遲延送達等損失時，不負任何賠償責任： 1.貨品之缺陷" +
        "、自然之耗損所致者。 2.因貨品之性質所引起之起火、爆炸、發霉、腐壞、變色、生銹等諸如此類之事由。 3.因罷工、怠工、社會運動事件或刑事案件所致者。\n\t\t\t\t\t\t\t\t\t\t\t\t4.不可歸責於運送人所引起之火災。 5.因無法預知或不可抗力因素或其他機關之決定所致之交通阻礙。 　 6.因地震、海嘯、大水、暴風雨、山崩等諸如此類之天災所" +
        "致者。 　 7.因法令或公權力執行所致之停止運送、拆封、沒收、查封、或交付第三人者。\n\t\t\t\t\t\t\t\t\t\t\t\t8.託運單記載錯誤，或因託運人、收件人之故意或過失所致者。 第十條 1.符合第四條之貨品，運送人除得即刻解除運送契約外，當其遺失、毀損、遲延送達等，運送人概不負賠償責任。 2.託運人於交寄貨物時，若未載明貨物品名、性質(諸如易碎、易變質、腐壞及其他應注意事項等)者\n\t\t\t\t\t\t\t\t\t\t\t\t" +
        "，運送人得依各家航空公司所訂定之行李運輸條款及各國民航法規之規定，主張責任限制。但非可歸責於運送人之事由，運送人不負賠償責任。 第十一條 運送人於將貨品放置於Sparbag指定交換站後，運送人之責任消滅。 第十三條 本條款所未規定者，概依運送人營業所所示之" +
        "託運注意事項辦理，若有未及者，則依一般航空法令等或習慣處理之。\n\t\t\t\t\t\t\t\t\t\t\t\t第十四條 個人資料條款 1.為提供您貨品託運服務（下簡稱「本服務」）及完成本服務，您同意提供相關個人資料予統一速達股份有限公司（下簡稱「本公司」）為提供本服務所必要之利用。 2.為完成本服務，您除同意Sparbag公司及運送人得以電話、電子郵件、簡訊等方式聯繫您，您並同意本公司得將您的個人資料提供給交易相關服務之配合廠商利用（如：各國海關及民航組織）。\n\t\t\t\t\t\t\t\t\t\t\t\t3.如您不願意提供您的基本資料，Sparbag公司及運送人將無法進一步提供本服務，尚請您包涵。\n\n\t\t\t\t\t\t\t\t\t\t\t";
    const rule_2 = "";
    const birthday = "";
    const phonenumber = "";
    const fb = "";
    const sql = `
        INSERT INTO Users ($<this:name>)
        VALUES ($<username>, $<email>, $<password>, $<passportnumber>, $<about_me>, $<rule_1>, $<rule_2>, $<birthday>, $<phonenumber>, $<fb>)
        RETURNING *
    `;

    return db.one(sql, {
        username,
        email,
        password,
        passportnumber,
        about_me,
        rule_1,
        rule_2,
        birthday,
        phonenumber,
        fb
    });
}

function store_article(about_me, check_item, rule_1, rule_2, username) {

    if (check_item == "需要")
        check_item = true;
    else
        check_item = false;

    const sql = `
        UPDATE Users
        SET about_me = $<about_me>, check_item = $<check_item>, rule_1 = $<rule_1>, rule_2 = $<rule_2>
        WHERE username = $<username>
        RETURNING *
    `;

    return db.one(sql, {
        about_me,
        check_item,
        rule_1,
        rule_2,
        username
    });
}

function store_profile(about_me, username, birthday, select_country, passportnumber, phonenumber, email, select_money, fb) {

    const sql = `
        UPDATE Users
        SET about_me = $<about_me>, birthday = $<birthday>, select_country = $<select_country>, passportnumber = $<passportnumber>,phonenumber = $<phonenumber>,email = $<email>,select_money = $<select_money>,fb = $<fb>
        WHERE username = $<username>
        RETURNING *
    `;

    return db.one(sql, {
        about_me,
        username,
        birthday,
        select_country,
        passportnumber,
        phonenumber,
        email,
        select_money,
        fb
    });
}

module.exports = {
    create_account,
    check_username,
    store_article,
    store_profile
};