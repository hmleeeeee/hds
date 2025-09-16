import StyleDictionary from "style-dictionary";

const config = {
	source: ["figma_token.json"],
	platforms: {
		scss: {
			transformGroup: "scss",
			buildPath: "build/",
			files: [
				{
					destination: "krds_tokens.scss",
					format: "scss/variables"
				}
			]
		},
		css: {
			transformGroup: "css",
			buildPath: "build/",
			files: [
				{
					destination: "krds_tokens.css",
					format: "inuixCustomFormat",
					options: {
						outputReferences: true,
						showFileHeader: true
					}
				}
			]
		}
	}
};

StyleDictionary.registerFormat({
	name: "inuixCustomFormat",
	format: function ({ dictionary, options, file }) {
		const { outputReferences } = options;
		let currentSection = "";

		const header = `@charset "utf-8";\n\n/* Do not edit directly */\n/* Generated on ${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })} */\n\n`;

		const tokens = dictionary.allTokens.reduce((acc, token) => {
			let value = token.value;
			let output = "";

			const section = token.path[0];
			if (section !== currentSection) {
				currentSection = section;
				const sectionMap = {
					color: "/* PRIMITIVE */",
					light: "\n\t/* MODE-LIGHT */",
					"high-contrast": "\n\t/* MODE-HIGH-CONTRAST */",
					pc: "\n\t/* RESPONSIVE-PC */",
					mobile: "\n\t/* RESPONSIVE-MOBILE */",
					"value-set": "\n\t/* SEMANTIC */"
				};

				if (sectionMap[section]) {
					output += sectionMap[section] + "\n";
				}
			}

			if (outputReferences && token.original.value.toString().includes("{")) {
				value = `var(--krds-${token.original.value.slice(1, -1).replace(/\./g, "-")})`;
			}

			return acc + output + `\t--krds-${token.name}: ${value};\n`;
		}, "");

		return header + `:root {\n${tokens}}`;
	}
});

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();

// 실행 : node customTokenBuilder.js
