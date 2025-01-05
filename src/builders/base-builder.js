export class BaseTableBuilder {
    constructor(data, options) {
        this.data = data
        this.options = options
    }

    getBaseStyles() {
        return `
            :host {
                display: block;
                cursor: var(--cursor, auto)
            }
            table {
                border-collapse: separate;
                border-spacing: 0
            }
            tbody th { text-align: left }
            td { text-align: right }
            th, td { padding: .25em .5em }
            .columnLabel { text-align: right }
        `
    }

    buildTable() {
        return `
            <table>
                <thead>${this.buildThead()}</thead>
                <tbody>${this.buildTbody()}</tbody>
            </table>
        `
    }

    buildThead() {
        throw new Error("buildThead must be implemented by child class")
    }

    buildTbody() {
        throw new Error("buildTbody must be implemented by child class")
    }

    // MARK: cell
    buildCell(value, irow, icol) {
        const formattedValue = this.getFormattedValue(value, icol)
        const attributes = this.getCellAttributes(irow, icol)

        return `<td ${attributes}>${formattedValue}</td>`
    }

    getFormattedValue(value, icol) {
        const attrs = this.data.columns.attrs[icol]
        const formatOptions = attrs.formatOptions ?? this.options
        return this.formatValue(value, attrs.dtype, formatOptions)
    }

    getCellAttributes(irow, icol) {
        const attrs = this.data.columns.attrs[icol]

        const dataAttributes = {
            "data-col": icol,
            "data-groups": attrs.groups.join(" "),
            "data-dtype": attrs.dtype
        }

        const edgeAttributes = {
            "index-edge": icol === 0,
            "group-edge": this.data.columns.edges.slice(1).includes(icol),
            "margin-edge-idx": this.testMarginEdge(this.data.index.values[irow]),
            "margin-edge-col": this.testMarginEdge(this.data.columns.values[icol])
        }

        return this.buildAttributeString({ ...dataAttributes, ...edgeAttributes })
    }

    buildAttributeString(attributes) {
        return Object.entries(attributes)
            .map(([key, value]) => {
                // If it's a boolean attribute (edge attributes)
                if (typeof value === "boolean") {
                    return value ? key : ""
                }
                // For regular key-value attributes
                return value ? `${key}="${value}"` : ""
            })
            .filter(Boolean)
            .join(" ")
    }

    // MARK: formatting
    formatValue(value, dtype, formatOptions) {
        if (value === null || Number.isNaN(value) || value === "") {
            return this.options.naRep
        }
        if (!dtype) return value

        const formatters = {
            int: this.formatNumber.bind(this),
            float: this.formatNumber.bind(this),
            datetime: this.formatDate.bind(this),
            default: value => value.toString()
        }

        return (formatters[dtype] || formatters.default)(value, formatOptions)
    }

    formatNumber(value, options) {
        return value.toLocaleString(this.options.locale, options)
    }

    formatDate(value, options) {
        return new Date(value).toLocaleString(this.options.locale, options)
    }

    // MARK: tests
    testMarginEdge(value) {
        return Array.isArray(value)
            ? value.some(v => this.options.marginLabels.includes(v))
            : this.options.marginLabels.includes(value)
    }
}
