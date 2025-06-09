// @ts-ignore
import localIconsName from 'virtual:svg-icons-names'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import awesomeIcons from "@fortawesome/fontawesome-free/metadata/icons.yml"
import JsYaml from 'js-yaml'


export const EL_ICON_PREFIX: string = 'el-icon-'
export const SVG_ICON_PREFIX: string = 'svg-icon-'

const awesomeIconsName: string[] = []
const elIconsName: string[] = []

for (const [, component] of Object.entries(ElementPlusIcons)) {
    elIconsName.push(`${EL_ICON_PREFIX}${component.name}`)
}

for(const key of Object.keys(awesomeIcons)){
    if (awesomeIcons[key].styles.includes("solid")) {
        awesomeIconsName.push(`fa-solid fa-${key}`);
	}
}


export function getElementIconNames() {
    return elIconsName
}

export function getLocalIconNames() {
    return localIconsName
}


export function getFontAwesomeIconNames(){
    return awesomeIconsName;
}