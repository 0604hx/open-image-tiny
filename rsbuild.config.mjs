import { defineConfig } from "@rsbuild/core"
import { pluginVue } from "@rsbuild/plugin-vue"

import pkg from './package.json'

const isProduction = process.env.NODE_ENV === 'production'

const buildVersion = ()=>{
    let now = new Date
    return `v${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}`
}
const version = isProduction? buildVersion() : 'DEV'

export default defineConfig({
    source:{
        alias:{
            "@"             : "./src",
        },
        define:{
            "_VERSION_"         : JSON.stringify(version),
            "_AUTHOR_"          : JSON.stringify(pkg.author),
            "APP_TITLE"         : JSON.stringify(pkg.cnName),
        }
    },
    html:{
        title: pkg.cnName
    },
    server:{
        port: 4000,
        host: "localhost"
    },
    output:{
        assetPrefix:"./",
        cleanDistPath: true,
        distPath:{
            js:"js",
            css:"css"
        },
        legalComments: 'none'
    },
    plugins:[
        pluginVue(),
    ],
    tools:{
        rspack:{
        }
    }
})
