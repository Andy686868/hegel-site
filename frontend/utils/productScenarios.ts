// utils/productScenarios.ts

export interface ProductScenario {
  showAmps: boolean;
  showShutters: boolean;
  showPlates: boolean;
  generateSKU: (params: any) => string;
}

export const getScenario = (baseSKU: string, series?: string, isBox?: boolean): ProductScenario => {
  const isMaster = series === "Master";
  const isAlfaIP44 = series === "Alfa IP44";

  // 0. КАТЕГОРИЯ: МОНТАЖНЫЕ КОРОБКИ (Новый тип)
  // Проверяем по флагу из БД или по характерным префиксам
  const isBoxProduct = isBox || ["КУ", "КР", "У1", "КРК"].some(pref => baseSKU?.startsWith(pref));

  if (isBoxProduct) {
    return {
      showAmps: false,
      showShutters: false,
      showPlates: false,
      generateSKU: () => baseSKU // Для коробок SKU обычно совпадает с базовым
    };
  }

  // 1. КАТЕГОРИЯ: РАМКИ (Р1, Р2, Р3, Р4, Р5)
  const isFrame = baseSKU?.startsWith("Р") && 
                  !baseSKU?.startsWith("РС") && 
                  !baseSKU?.startsWith("РСТ");

  if (isFrame) {
    return {
      showAmps: false,
      showShutters: false,
      showPlates: false,
      generateSKU: ({ color }: any) => {
        const colorSuffix = color !== "00" ? `-${color}` : "";
        if (isMaster) {
          const framePosts = baseSKU.replace("Р", "");
          return `Р40${framePosts}${colorSuffix}`; 
        }
        return `${baseSKU}${colorSuffix}`;
      }
    };
  }

  // 2. КАТЕГОРИЯ: СТАТИЧНЫЕ МЕХАНИЗМЫ (Диммеры и IT-розетки)
  const isDimmer = baseSKU?.startsWith("ДС");
  const isCommunication = 
    baseSKU?.startsWith("РСТ") || 
    baseSKU?.startsWith("РСК") || 
    baseSKU?.startsWith("РСКК") ||
    baseSKU?.startsWith("РСКТ") || 
    baseSKU?.startsWith("РСТВ");
  
  const isStatic = isDimmer || isCommunication;

  if (isStatic) {
    return {
      showAmps: isDimmer, 
      showShutters: false,
      showPlates: false,
      generateSKU: ({ color }: any) => {
        const colorSuffix = color !== "00" ? `-${color}` : "";
        if (isDimmer) {
          const restOfSku = baseSKU.replace("ДС", "");
          return `ДС2${restOfSku}${colorSuffix}`;
        }
        return `${baseSKU}${colorSuffix}`;
      }
    };
  }

  // 3. КАТЕГОРИЯ: СТАНДАРТНЫЕ МЕХАНИЗМЫ (Розетки, Блоки, Выключатели)
  const isSocket = baseSKU?.startsWith("РА") || baseSKU?.startsWith("РС");
  const isBlock = baseSKU?.startsWith("БА");
  const isSwitch = baseSKU?.startsWith("ВС") || baseSKU?.startsWith("ВА");
  const isSocketOrBlock = isSocket || isBlock;
  
  const mechDigits = baseSKU?.replace(/\D/g, "") || "";

  return {
    showAmps: true, 
    showShutters: isSocketOrBlock, 
    showPlates: !isAlfaIP44 && !isMaster, 

    generateSKU: ({ amp, color, plateType, shutters }: any) => {
      let typePrefix = "ВА";
      if (baseSKU?.startsWith("РА")) typePrefix = "РА";
      if (baseSKU?.startsWith("РС")) typePrefix = "РС";
      if (baseSKU?.startsWith("БА")) typePrefix = "БА";
      if (baseSKU?.startsWith("ВС")) typePrefix = "ВС";

      if (isMaster && isSwitch) {
        typePrefix = amp === "16" ? "ВА" : "ВС";
      }

      const colorSuffix = color !== "00" ? `-${color}` : "";

      if (isMaster) {
        if (isSwitch) {
          return `${typePrefix}${amp}-${mechDigits}${colorSuffix}`;
        }
        if (isSocket) {
          const socketBase = mechDigits.slice(0, 2); 
          const lastDigit = shutters ? "2" : "1";
          return `${typePrefix}${amp}-${socketBase}${lastDigit}${colorSuffix}`;
        }
      }

      if (isAlfaIP44) {
        if (isBlock) {
          const first = mechDigits.charAt(0);
          const last = mechDigits.charAt(1);
          const mid = shutters ? "2" : "1"; 
          return `${typePrefix}${amp}-${first}${mid}${last}${colorSuffix}`;
        } 
        if (isSocket) {
          const lastDigit = shutters ? "2" : "1";
          return `${typePrefix}${amp}-2${mechDigits}${lastDigit}${colorSuffix}`;
        }
        return `${typePrefix}${amp}-2${mechDigits}${colorSuffix}`;
      }

      const mechBase = mechDigits.slice(0, 2); 
      let lastDigit = "1";
      if (isSocketOrBlock) {
        if (plateType === "none") lastDigit = shutters ? "2" : "1";
        if (plateType === "izol") lastDigit = shutters ? "4" : "3";
        if (plateType === "mont") lastDigit = shutters ? "6" : "5";
      } else {
        if (plateType === "none") lastDigit = "1";
        if (plateType === "izol") lastDigit = "3";
        if (plateType === "mont") lastDigit = "5";
      }
      return `${typePrefix}${amp}-${mechBase}${lastDigit}${colorSuffix}`;
    }
  };
};

export const getPlateName = (id: string) => {
  const names: { [key: string]: string } = {
    "1": "Без пластин", 
    "2": "Без пластин + шторки",
    "3": "С пластиной изолирующей", 
    "4": "С пластиной изолирующей + шторки",
    "5": "С пластиной монтажной", 
    "6": "С пластиной монтажной + шторки"
  };
  return names[id] || `Вариант №${id}`;
};