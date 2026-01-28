const fs = require('fs');
const csv = require('csv-parser');
const fetch = require('node-fetch');

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
const API_URL = 'https://hegel-backend.onrender.com';
const API_TOKEN = '484b97013bdc9959fc322a2a7e32b7aacd204ebe86b11026f5c18917ff41b22e8a72a23df50c10b91c2b7516cd4852f9610a2568015be6e05823fe0bc7d8e1b7eb93deffc7980003ae75cf448d10063d84b4c3b7e9b84dba813c69dc606f7a51f8c1c1ad7ed91e066c7d3e14d88c1811592d8f5884bdcb3e8b1d0cd13c00fe76'; 
const COLLECTION_NAME = 'product-boxes'; 
const CSV_FILE_PATH = 'boxes.csv'; 

const translit = (word) => {
    const converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'e', 'Ж': 'zh', 'З': 'z',
        'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r',
        'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'c', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch',
        'Ь': '', 'Ы': 'y', 'Ъ': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
    };
    return word.split('').map(char => converter[char] || char).join('').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
};

// СПИСОК ИСКЛЮЧЕНИЙ: Эти поля НЕ попадут в TechParams
const EXCLUDE_FROM_TECH = [
    'BaseSKU', 'Name', 'Series', 'Type', 'Slug', 'PackCount', 
    'InnerSize', 'NicheSize', 'CenterDist', 'Voltage', 'Vlaga', 
    'FireResistance', 'Dimensions', 'WorkingTemp', 'Material', 'Note',
    'Inner_L', 'Inner_W', 'Inner_H', 'Outer_L', 'Outer_W', 'Outer_H', 
    'Niche_L', 'Niche_W', 'Niche_H', 'Inner_is_dia', 'Outer_is_dia', 
    'Niche_is_dia', 'Config_ID', 'CoverMaterial',
];

const clean = (val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    return (s === '' || s.toLowerCase() === 'nan') ? null : s;
};

const runImport = async () => {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.replace(/^\uFEFF/g, '').trim() }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`🚀 Начинаю чистый импорт ${results.length} строк...`);

            for (const row of results) {
                const sku = clean(row.BaseSKU);
                if (!sku) continue;

                const techArray = [];
                Object.keys(row).forEach(key => {
                    const val = clean(row[key]);
                    // Добавляем только если ключа нет в списке исключений
                    if (val !== null && !EXCLUDE_FROM_TECH.includes(key)) {
                        techArray.push(`${key}:${val}`);
                    }
                });

                const payload = {
                    data: {
                        Name: clean(row.Name),
                        BaseSKU: sku,
                        Slug: translit(sku),
                        Series: clean(row.Series),
                        Type: clean(row.Type),
                        PackCount: clean(row.PackCount),
                        InnerSize: clean(row.InnerSize) || (row.Inner_L ? `${row.Inner_L}${row.Inner_W ? 'x'+row.Inner_W : ''}${row.Inner_H ? 'x'+row.Inner_H : ''}` : null),
                        Dimensions: clean(row.Dimensions) || (row.Outer_L ? `${row.Outer_L}${row.Outer_W ? 'x'+row.Outer_W : ''}${row.Outer_H ? 'x'+row.Outer_H : ''}` : null),
                        Material: clean(row.Material),
                        Vlaga: clean(row.Vlaga),
                        Voltage: clean(row.Voltage),
                        FireResistance: clean(row.FireResistance),
                        WorkingTemp: clean(row.WorkingTemp),
                        CenterDist: clean(row.CenterDist),
                        TechParams: techArray.join('|')
                    }
                };

                try {
                    await fetch(`${API_URL}/api/${COLLECTION_NAME}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` },
                        body: JSON.stringify(payload)
                    });
                    console.log(`✅ [${sku}] - импорт завершен`);
                } catch (e) {
                    console.error(`❌ Ошибка [${sku}]: ${e.message}`);
                }
            }
        });
};

runImport();