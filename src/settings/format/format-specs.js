import { PREFERRED_CURRENCIES } from "../../config.js"


export function getOptionSpec(dtype, optionKey) {
    const spec = getFormatSpec(dtype)
    if (!spec) return null

    for (const group of Object.values(spec.options)) {
        if (optionKey in group) return group[optionKey]
    }
    return null
}

export const NumberFormatSpec = {
    options: {
        format: {
            style: {
                type: "select",
                label: "Style",
                options: ["decimal", "currency", "percent"],
                default: "decimal",
                controlMapping: {
                    currency: "currencyOptions",
                    percent: "percentOptions"
                },
                summary: value => value === "percent" ? "%" : null,
            },
            notation: {
                type: "select",
                label: "Notation",
                options: ["standard", "compact", "engineering", "scientific"],
                default: "standard",
                summary: value => ({standard: null, compact: "comp", engineering: "eng", scientific: "sci"})[value],
            },
            useGrouping: {
                type: "boolean",
                label: "Show thousands separator",
                default: true,
                summary: value => value ? "sep" : null,
            },
            signDisplay: {
                type: "select",
                label: "Sign display",
                options: ["auto", "always", "never", "exceptZero"],
                default: "auto",
                summary: value => ["auto", "never"].includes(value) ? null : "+",
            },
            roundingMode: {
                type: "select",
                label: "Rounding mode",
                options: ["halfExpand", "ceil", "floor", "expand", "trunc"],
                default: "halfExpand",
            }
        },
        decimalOptions: {
            sectionLabel: "Decimal Format",
            minimumFractionDigits: {
                type: "number",
                label: "Minimum decimals",
                min: 0,
                max: 20,
                default: 2,
                summary: value => value > 0 ? `${value}d` : null,
            },
            maximumFractionDigits: {
                type: "number",
                label: "Maximum decimals",
                min: 0,
                max: 20,
                default: 2,
            },
            trailingZeroDisplay: {
                type: "select",
                label: "Trailing zeros",
                options: ["auto", "stripIfInteger"],
                default: "auto",
            }
        },
        currencyOptions: {
            sectionLabel: "Currency Format",
            currency: {
                type: "datalist",
                label: "Currency",
                options: Intl.supportedValuesOf("currency"),
                commonOptions: PREFERRED_CURRENCIES,
                default: "EUR",
                summary: value => value
            },
            currencyDisplay: {
                type: "select",
                label: "Currency display",
                options: ["symbol", "narrowSymbol", "code", "name"],
                default: "symbol",
            },
            currencySign: {
                type: "select",
                label: "Sign display",
                options: ["standard", "accounting"],
                default: "standard",
            }
        },
        percentOptions: {
            sectionLabel: "Percent Format",
            scale: {
                type: "number",
                label: "Scale factor",
                min: 1,
                max: 100,
                default: 1,
            }
        }
    }
}

export const DateFormatSpec = {
    options: {
        format: {
            formatType: {
                type: "select",
                label: "Format type",
                options: ["preset", "custom"],
                default: "preset",
                controlMapping: {
                    preset: "presetOptions",
                    custom: "customOptions",
                }
            },
        },
        presetOptions: {
            sectionLabel: "Preset Format",
            dateStyle: {
                type: "select",
                label: "Date style",
                options: ["full", "long", "medium", "short", "none"],
                default: "short",
                summary: value => value === "none" ? null : value.charAt(0),
            },
            timeStyle: {
                type: "select",
                label: "Time style",
                options: ["full", "long", "medium", "short", "none"],
                default: "none",
                summary: value => value === "none" ? null : "t",
            }
        },
        customOptions: {
            sectionLabel: "Custom Format",
            weekday: {
                type: "select",
                label: "Weekday",
                options: ["long", "short", "narrow", "none"],
                default: "none",
            },
            era: {
                type: "select",
                label: "Era",
                options: ["long", "short", "narrow", "none"],
                default: "none",
            },
            year: {
                type: "select",
                label: "Year",
                options: ["numeric", "2-digit", "none"],
                default: "numeric",
                summary: value => value === "none" ? null : "y",
            },
            month: {
                type: "select",
                label: "Month",
                options: ["numeric", "2-digit", "long", "short", "narrow", "none"],
                default: "numeric",
                summary: value => value === "none" ? null : "m",
            },
            day: {
                type: "select",
                label: "Day",
                options: ["numeric", "2-digit", "none"],
                default: "numeric",
                summary: value => value === "none" ? null : "d",
            },
            hour: {
                type: "select",
                label: "Hour",
                options: ["numeric", "2-digit", "none"],
                default: "none",
                summary: value => value === "none" ? null : "H",

            },
            minute: {
                type: "select",
                label: "Minute",
                options: ["numeric", "2-digit", "none"],
                default: "none",
                summary: value => value === "none" ? null : "M",
            },
            second: {
                type: "select",
                label: "Second",
                options: ["numeric", "2-digit", "none"],
                default: "none",
                summary: value => value === "none" ? null : "S",
            },
            hourCycle: {
                type: "select",
                label: "Hour cycle",
                options: ["h11", "h12", "h23", "h24"],
                default: "h23",
            }
        }
    }
}

export const FORMAT_SPECS = {
    float: NumberFormatSpec,
    int: NumberFormatSpec,
    datetime: DateFormatSpec
    // Add other specs here
}

export function getFormatSpec(dtype) {
    return FORMAT_SPECS[dtype] ?? null
}
