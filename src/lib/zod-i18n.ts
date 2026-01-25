import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

// bahasa Indonesia
import translation from "zod-i18n-map/locales/id/zod.json";

i18next.init({
    lng: "id",
    resources: {
        id: {
            zod: translation,
        },
    },
});

// set global error map
z.setErrorMap(zodI18nMap);

// export z yang sudah dikonfigurasi
export { z };
