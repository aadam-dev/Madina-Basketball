const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak, TabStopType, TabStopPosition,
} = require('/Users/aadam/.nvm/versions/node/v18.20.8/lib/node_modules/docx');
const fs = require('fs');

// ─── Palette ──────────────────────────────────────────────────────────────────
const ORANGE  = 'FF6B35';
const BLUE    = '004E89';
const YELLOW  = 'FFD23F';
const WHITE   = 'FFFFFF';
const NEAR_BLACK = '1A1A2E';
const GRAY_TEXT  = '555555';
const GRAY_LIGHT = 'F0F4F8';
const GRAY_MID   = 'CCCCCC';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function divider(color = BLUE, spaceAfter = 160) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color, space: 1 } },
    spacing: { after: spaceAfter },
    children: [],
  });
}

function spacer(pt = 120) {
  return new Paragraph({ spacing: { after: pt }, children: [] });
}

function boldRun(text, opts = {}) {
  return new TextRun({ text, bold: true, font: 'Georgia', ...opts });
}

function normalRun(text, opts = {}) {
  return new TextRun({ text, font: 'Calibri', size: 22, ...opts });  // 11pt
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ORANGE, space: 1 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        font: 'Georgia',
        size: 26,          // 13pt
        color: BLUE,
        allCaps: true,
        characterSpacing: 40,
      }),
    ],
  });
}

function subHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({ text, bold: true, font: 'Georgia', size: 24, color: BLUE }),
    ],
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 140, line: 280 },
    children: [normalRun(text)],
    ...opts,
  });
}

function bullet(text, bold_prefix = '') {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80 },
    children: [
      ...(bold_prefix ? [new TextRun({ text: bold_prefix + ' ', bold: true, font: 'Calibri', size: 22 })] : []),
      normalRun(text),
    ],
  });
}

function orangeHighlight(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + ': ', bold: true, font: 'Calibri', size: 22, color: ORANGE }),
      normalRun(value),
    ],
  });
}

// ─── Stat card table ──────────────────────────────────────────────────────────
function statBox(stat, label, color = BLUE) {
  const cellBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  return new TableCell({
    borders,
    shading: { fill: color, type: ShadingType.CLEAR },
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
    verticalAlign: VerticalAlign.CENTER,
    width: { size: 2340, type: WidthType.DXA },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: stat, bold: true, font: 'Georgia', size: 48, color: WHITE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40 },
        children: [new TextRun({ text: label, font: 'Calibri', size: 18, color: WHITE })],
      }),
    ],
  });
}

// ─── Package tier table ───────────────────────────────────────────────────────
const cellBorderNone = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: cellBorderNone, bottom: cellBorderNone, left: cellBorderNone, right: cellBorderNone };

function pkgHeader(text, fill) {
  return new TableCell({
    borders: noBorders,
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 160, bottom: 160, left: 160, right: 160 },
    verticalAlign: VerticalAlign.CENTER,
    width: { size: 2340, type: WidthType.DXA },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: 'Georgia', size: 24, color: WHITE })],
    })],
  });
}

function pkgCell(text, fill, isLabel = false) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new TableCell({
    borders,
    shading: { fill: isLabel ? 'E8EEF4' : fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    width: { size: 2340, type: WidthType.DXA },
    children: [new Paragraph({
      alignment: isLabel ? AlignmentType.LEFT : AlignmentType.CENTER,
      children: [new TextRun({
        text,
        font: 'Calibri',
        size: 20,
        bold: isLabel,
        color: isLabel ? NEAR_BLACK : GRAY_TEXT,
      })],
    })],
  });
}

// ─── Document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '▪',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 260 } } },
        }],
      },
    ],
  },

  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22, color: NEAR_BLACK } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Georgia', color: BLUE },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Georgia', color: BLUE },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
    ],
  },

  sections: [
    // ══════════════════════════════════════════════════════════════════════════
    // SECTION 1 — Cover page (no header/footer)
    // ══════════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },          // A4
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      children: [
        // ── Orange banner ──────────────────────────────────────────────────
        new Paragraph({
          shading: { fill: ORANGE, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 400, lineRule: 'exact' },
          indent: { left: 1000, right: 1000 },
          children: [
            new TextRun({ text: '', font: 'Calibri', size: 20 }),
          ],
        }),
        new Paragraph({
          shading: { fill: ORANGE, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 280, lineRule: 'exact' },
          indent: { left: 1000, right: 1000 },
          children: [
            new TextRun({ text: 'MADINA BASKETBALL', bold: true, font: 'Georgia', size: 52, color: WHITE }),
          ],
        }),
        new Paragraph({
          shading: { fill: ORANGE, type: ShadingType.CLEAR },
          spacing: { before: 60, after: 0, line: 280, lineRule: 'exact' },
          indent: { left: 1000, right: 1000 },
          children: [
            new TextRun({ text: 'Libya Quarters, Madina, Accra  |  madinabball.vercel.app', font: 'Calibri', size: 20, color: WHITE }),
          ],
        }),
        new Paragraph({
          shading: { fill: ORANGE, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 400, lineRule: 'exact' },
          indent: { left: 1000, right: 1000 },
          children: [new TextRun({ text: '', font: 'Calibri', size: 20 })],
        }),

        // ── Blue mid-band ──────────────────────────────────────────────────
        new Paragraph({
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 200, lineRule: 'exact' },
          children: [new TextRun({ text: '', size: 20 })],
        }),

        // ── White body ─────────────────────────────────────────────────────
        spacer(2400),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'CORPORATE SPONSORSHIP PROPOSAL', bold: true, font: 'Georgia', size: 32, color: ORANGE, allCaps: true, characterSpacing: 60 }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: 'Presented to', font: 'Calibri', size: 24, color: GRAY_TEXT, italics: true }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'BULK OIL STORAGE AND', bold: true, font: 'Georgia', size: 42, color: BLUE }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'TRANSPORTATION COMPANY', bold: true, font: 'Georgia', size: 42, color: BLUE }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'OF GHANA LIMITED', bold: true, font: 'Georgia', size: 42, color: BLUE }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [
            new TextRun({ text: '(BOST)', bold: true, font: 'Georgia', size: 36, color: BLUE }),
          ],
        }),

        divider(GRAY_MID, 400),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Community Sport, Corporate Responsibility, Shared Legacy', font: 'Calibri', size: 22, color: GRAY_TEXT, italics: true }),
          ],
        }),

        spacer(600),

        // Date / Ref block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Ref: MBK/BOST/CSR/2026/01', font: 'Calibri', size: 20, color: GRAY_TEXT }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: '19 May 2026', font: 'Calibri', size: 20, color: GRAY_TEXT }),
          ],
        }),

        spacer(1600),

        // ── Footer band ────────────────────────────────────────────────────
        new Paragraph({
          shading: { fill: NEAR_BLACK, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 200, lineRule: 'exact' },
          children: [new TextRun({ text: '', size: 20 })],
        }),
        new Paragraph({
          shading: { fill: NEAR_BLACK, type: ShadingType.CLEAR },
          alignment: AlignmentType.CENTER,
          indent: { left: 1000, right: 1000 },
          spacing: { before: 100, after: 0, line: 280, lineRule: 'exact' },
          children: [
            new TextRun({ text: 'CONFIDENTIAL  —  For the attention of the BOST Corporate Social Responsibility Office', font: 'Calibri', size: 18, color: GRAY_MID }),
          ],
        }),
        new Paragraph({
          shading: { fill: NEAR_BLACK, type: ShadingType.CLEAR },
          spacing: { before: 0, after: 0, line: 280, lineRule: 'exact' },
          children: [new TextRun({ text: '', size: 20 })],
        }),

        new Paragraph({ children: [new PageBreak()] }),
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // SECTIONS 2+ — body pages (with header & footer)
    // ══════════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 },
        },
      },

      headers: {
        default: new Header({
          children: [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ORANGE, space: 1 } },
              spacing: { after: 100 },
              children: [
                new TextRun({ text: 'MADINA BASKETBALL', bold: true, font: 'Georgia', size: 18, color: ORANGE }),
                new TextRun({ text: '\t', font: 'Calibri', size: 18 }),
                new TextRun({ text: 'Corporate Sponsorship Proposal — BOST', font: 'Calibri', size: 18, color: GRAY_TEXT, italics: true }),
              ],
            }),
          ],
        }),
      },

      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: GRAY_MID, space: 1 } },
              spacing: { before: 80 },
              children: [
                new TextRun({ text: 'CONFIDENTIAL  |  Ref: MBK/BOST/CSR/2026/01', font: 'Calibri', size: 16, color: GRAY_TEXT }),
                new TextRun({ text: '\tPage ', font: 'Calibri', size: 16, color: GRAY_TEXT }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: GRAY_TEXT }),
                new TextRun({ text: ' of ', font: 'Calibri', size: 16, color: GRAY_TEXT }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Calibri', size: 16, color: GRAY_TEXT }),
              ],
            }),
          ],
        }),
      },

      children: [

        // ════════════════════════════════════════════════════════════════════
        // PAGE 2 — LETTER OF TRANSMITTAL
        // ════════════════════════════════════════════════════════════════════

        // Sender
        new Paragraph({
          spacing: { after: 80 },
          children: [boldRun('The Executive Committee', { size: 22, color: NEAR_BLACK })],
        }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Madina Basketball')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Libya Quarters, Madina')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Accra, Ghana')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Email: themadinacourt@gmail.com')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Web: madinabball.vercel.app')] }),

        spacer(200),

        new Paragraph({ spacing: { after: 80 }, children: [normalRun('19 May 2026')] }),

        spacer(200),

        // Recipient
        new Paragraph({ spacing: { after: 80 }, children: [boldRun('The Chief Executive Officer', { size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [boldRun('Bulk Oil Storage and Transportation Company of Ghana Limited (BOST)', { size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('BOST House, High Street')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('P.O. Box 1360')] }),
        new Paragraph({ spacing: { after: 80 }, children: [normalRun('Accra, Ghana')] }),

        spacer(160),
        divider(ORANGE, 160),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'RE: CORPORATE SPONSORSHIP PROPOSAL — MADINA BASKETBALL', bold: true, font: 'Georgia', size: 24, color: BLUE }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'Ref: MBK/BOST/CSR/2026/01  |  19 May 2026', font: 'Calibri', size: 20, color: GRAY_TEXT, italics: true }),
          ],
        }),

        bodyPara('Dear Sir / Madam,'),

        bodyPara(
          'On behalf of the Executive Committee of Madina Basketball, I write with deep respect to invite the Bulk Oil Storage and Transportation Company of Ghana Limited (BOST) into a meaningful and enduring partnership with one of Accra\'\2 most vibrant grassroots basketball communities.',
        ),
        bodyPara(
          'Since our official court launch in June 2025, Madina Basketball has grown from a community dream into a fully operational facility in the heart of Libya Quarters, Madina. In under one year, we have registered over 150 active players, hosted more than 12 community events, and established two competitive teams — all built on principles of transparency, inclusion, and community ownership.',
        ),
        bodyPara(
          'We are now approaching BOST with a dual proposition: a title sponsorship for our upcoming competitive game, and an invitation to enter a long-term Corporate Social Responsibility (CSR) partnership that will anchor BOST\'\2 legacy in the social fabric of the Madina community for years to come.',
        ),
        bodyPara(
          'This proposal outlines the scope of the partnership, the tangible CSR alignment with BOST\'\2 mandate, the clear community impact, and the specific benefits your organisation will receive. We have maintained 100% financial transparency since inception and stand ready to provide any documentation requested.',
        ),
        bodyPara(
          'We would be honoured to discuss this proposal at your convenience and are available for a presentation at BOST\'\2 offices at any time.',
        ),

        spacer(160),
        bodyPara('Yours faithfully,'),
        spacer(400),

        new Paragraph({ spacing: { after: 40 }, children: [boldRun('Shafic', { size: 22 })] }),
        new Paragraph({ spacing: { after: 40 }, children: [normalRun('Co-Founder & Executive Committee')] }),
        new Paragraph({ spacing: { after: 40 }, children: [normalRun('Madina Basketball')] }),
        new Paragraph({ spacing: { after: 40 }, children: [normalRun('themadinacourt@gmail.com  |  madinabball.vercel.app')] }),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 3 — EXECUTIVE SUMMARY
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('Executive Summary'),

        bodyPara(
          'Madina Basketball is a community-led basketball initiative based at Libya Quarters, Madina, Accra. In 2025 the community collectively funded and executed the renovation of a neglected public basketball court into a modern, active facility — on time, on budget, and fully transparent.',
        ),
        bodyPara(
          'We are seeking BOST\'\2 partnership at two levels:',
        ),

        bullet('A Title Sponsorship for our upcoming marquee game, delivering immediate brand visibility across Madina and its surrounding communities.'),
        bullet('A Long-Term Institutional Partnership that positions BOST as the anchor CSR partner of Madina Basketball for a minimum of two years, embedding the BOST brand in one of the fastest-growing community sport movements in Greater Accra.'),

        spacer(200),

        // Stat cards
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2366],
          rows: [
            new TableRow({
              children: [
                statBox('150+', 'Registered Players', BLUE),
                statBox('12+', 'Events Hosted', ORANGE),
                statBox('18', 'Community Donors', BLUE),
                statBox('100%', 'Financial Transparency', ORANGE),
              ],
            }),
          ],
        }),

        spacer(200),

        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2366],
          rows: [
            new TableRow({
              children: [
                statBox('GHS 44,750', 'Community Raised', NEAR_BLACK),
                statBox('120%', 'Funding Target Met', BLUE),
                statBox('5', 'Teams in Top 4 Fever', ORANGE),
                statBox('2 Teams', 'Active & Competing', NEAR_BLACK),
              ],
            }),
          ],
        }),

        spacer(240),

        bodyPara(
          'This partnership directly addresses BOST\'\2 CSR mandate across three pillars: community development, youth empowerment, and environmental sustainability — while delivering measurable brand visibility in a high-engagement, youthful demographic.',
        ),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 4 — ABOUT MADINA BASKETBALL
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('About Madina Basketball'),

        subHeading('Our Story'),
        bodyPara(
          'What began as a conversation between two friends — Shafic and Adam — in April 2025 became, within three months, a fully renovated, operational community basketball court. Faced with a neglected and unusable court in Libya Quarters, the founders mobilised engineers, coaches, volunteers, and 18 community donors to raise GHS 44,750 and complete the renovation in a single week.',
        ),
        bodyPara(
          'The court was officially launched on 22 June 2025 with a competitive game between Madina and Kawukudi. It was not just a sporting event — it was a declaration that grassroots communities in Ghana can self-organise, self-fund, and self-deliver major infrastructure projects with full accountability.',
        ),

        subHeading('Key Milestones'),
        bullet('April 2025 — Project conceptualised; site assessment by engineering professionals'),
        bullet('June 2025 — Renovation completed in 7 days; court officially launched'),
        bullet('July 2025 — Madina Old Gees joins as second resident team'),
        bullet('November 2025 — Zurak Basketball Team launched'),
        bullet('January 2026 — Solar lighting installation attempted; supplier equipment proved defective'),
        bullet('May 2026 — 150+ registered players across daily sessions, training & competitions; solar upgrade actively being pursued'),

        spacer(120),

        subHeading('Our Infrastructure Vision: Solar Independence'),
        bodyPara(
          'In January 2026 Madina Basketball attempted to install a solar lighting system — motivated by a genuine desire to enable evening play, reduce operating costs, and build a sustainable community facility. Unfortunately the equipment supplied proved defective; the batteries sourced by the supplier failed to perform, and the lights were subsequently removed. The court currently operates on the national grid.',
        ),
        bodyPara(
          'This setback has not changed our vision. It has sharpened it. We now understand that achieving true solar independence requires industrial-grade equipment beyond what community funds alone can secure. This is one of the most concrete and impactful ways a BOST partnership could leave a lasting physical legacy — enabling a properly specified, reliable solar lighting solution that would be named and branded in BOST\'\2 honour.',
        ),

        subHeading('Our Teams'),
        bullet('Zurak Basketball Team — competitive squad representing Madina at inter-community tournaments'),
        bullet('Madina Old Gees — a veterans team bridging generations and keeping experienced players active'),
        bullet('Daily open sessions, structured training, and youth development programmes run alongside competitive play'),

        subHeading('Our Governance & Transparency Model'),
        bodyPara(
          'Every cedis raised and spent is documented, publicly accessible, and verifiable. Our live donation dashboard (hosted on our website) shows the full fundraising journey: 18 named donors, every amount received, and a complete BOQ breakdown. The GHS 7,500 surplus (20% over target) is held in reserve for ongoing maintenance — a signal of financial discipline that distinguishes Madina Basketball from typical community initiatives.',
        ),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 5 — CSR ALIGNMENT
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('CSR Alignment with BOST\'\2 Mandate'),

        bodyPara(
          'BOST\'\2 Corporate Social Responsibility framework is anchored in the belief that national enterprises must invest in the communities where they operate and the citizens they ultimately serve. A partnership with Madina Basketball delivers measurable impact across three of the most significant CSR pillars:',
        ),

        spacer(100),

        subHeading('1.  Youth Empowerment & Social Development'),
        bodyPara(
          'Basketball is more than sport. It is discipline, teamwork, conflict resolution, and aspiration. Madina Basketball\'\2 youth development programme actively engages boys and girls from Libya Quarters and surrounding communities, providing structured coaching, mentorship, and a safe, positive recreational outlet.',
        ),
        bullet('150+ registered players — predominantly youth and young adults'),
        bullet('Structured coaching by qualified coaches: Kwame, Hisham, Lord, and Jesse'),
        bullet('Inclusive programme welcoming all skill levels, genders, and age groups'),
        bullet('Alternative to idleness and anti-social behaviour in a dense urban community'),

        spacer(120),

        subHeading('2.  Community Development & Infrastructure'),
        bodyPara(
          'BOST\'\2 sponsorship contributes directly to the sustainability of a piece of public community infrastructure — infrastructure that was built by the community, for the community. This is not a charity grant. It is an investment in a proven, self-sufficient organisation with a demonstrated track record.',
        ),
        bullet('Community-owned and community-operated facility in a high-density Accra suburb'),
        bullet('Transparent governance model sets a benchmark for community development projects across Ghana'),
        bullet('Court hosts 12+ events per year, generating community cohesion beyond sport'),
        bullet('Supports the Ghana government\'\2 broader agenda for accessible public sport facilities'),

        spacer(120),

        subHeading('3.  Environmental Sustainability — A Legacy BOST Can Build'),
        bodyPara(
          'As Ghana\'\2 primary petroleum storage and transportation company, BOST occupies a unique position to champion the responsible energy transition. Madina Basketball attempted a solar lighting installation in January 2026, but the equipment — sourced through a supplier with defective batteries — failed to perform. The court currently operates on the national grid.',
        ),
        bodyPara(
          'We are being transparent about this because we believe honesty strengthens partnerships. And because this gap represents one of the most compelling, tangible, and visible CSR opportunities in this proposal: BOST could fund and install a properly specified industrial-grade solar lighting system at Madina Zurak Court — a physical asset bearing the BOST name, in a community BOST serves, powered by clean energy.',
        ),
        bullet('A "BOST Solar Court" naming opportunity — visible, permanent, and photographable'),
        bullet('Authentic ESG story: Ghana\'\2 energy company enabling renewable energy in community sport'),
        bullet('Practical impact: night play, extended court hours, lower operating costs for the community'),
        bullet('Demonstrable environmental outcome suitable for BOST\'\2 annual CSR and regulatory disclosures'),

        spacer(160),

        // Alignment summary table
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [3200, 3200, 2986],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 3200, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'BOST CSR Pillar', bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
                }),
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 3200, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Madina Basketball Delivery', bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
                }),
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 2986, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Evidence', bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
                }),
              ],
            }),
            ...[
              ['Youth Empowerment', '150+ youth in active play & coaching', 'Registered player database'],
              ['Community Development', 'Active court in high-density urban area', 'GHS 44,750 project documentation'],
              ['Environmental Sustainability', 'Solar upgrade project — BOST can lead this', 'Documented installation attempt & spec'],
              ['Transparency & Governance', '100% public financial disclosure', 'Live dashboard on website'],
              ['Sports Development', '2 competitive teams + tournaments', 'Event history & media coverage'],
            ].map(([col1, col2, col3], i) => {
              const fill = i % 2 === 0 ? GRAY_LIGHT : WHITE;
              const bdr = { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID };
              const bdrs = { top: bdr, bottom: bdr, left: bdr, right: bdr };
              const cell = (text, w) => new TableCell({
                borders: bdrs,
                shading: { fill, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                width: { size: w, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text, font: 'Calibri', size: 20 })] })],
              });
              return new TableRow({ children: [cell(col1, 3200), cell(col2, 3200), cell(col3, 2986)] });
            }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 6 — SPONSORSHIP PACKAGES
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('Sponsorship Packages'),

        bodyPara(
          'We present two complementary sponsorship tracks: a Game Sponsorship for the upcoming marquee fixture, and a Long-Term Partnership for sustained community engagement. BOST may elect either track independently, or combine both for maximum impact and visibility.',
        ),

        spacer(120),
        subHeading('TRACK A — The Top 4 Fever Game 2026 — Title Sponsorship'),

        bodyPara(
          'Madina Old Gees Basketball is hosting The Top 4 Fever Game 2026 — a multi-team competitive event bringing five clubs to Madina Zurak Court on 30 May 2026. Scheduled to coincide with Sallah celebrations, this event will draw families, youth, and supporters from across the Madina catchment for a full day of high-energy basketball.',
        ),

        // Game details info bar
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [3128, 3128, 3130],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 3128, type: WidthType.DXA },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'DATE', bold: true, font: 'Georgia', size: 18, color: YELLOW })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '30 May 2026', bold: true, font: 'Georgia', size: 24, color: WHITE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '9:30 AM', font: 'Calibri', size: 20, color: WHITE })] }),
                  ],
                }),
                new TableCell({
                  borders: noBorders,
                  shading: { fill: ORANGE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 3128, type: WidthType.DXA },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'VENUE', bold: true, font: 'Georgia', size: 18, color: NEAR_BLACK })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Madina Zurak Court', bold: true, font: 'Georgia', size: 22, color: WHITE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Libya Quarters, Madina', font: 'Calibri', size: 20, color: WHITE })] }),
                  ],
                }),
                new TableCell({
                  borders: noBorders,
                  shading: { fill: NEAR_BLACK, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 3130, type: WidthType.DXA },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'TEAMS', bold: true, font: 'Georgia', size: 18, color: YELLOW })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '5 Teams Competing', bold: true, font: 'Georgia', size: 22, color: WHITE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Top 4 Format', font: 'Calibri', size: 20, color: WHITE })] }),
                  ],
                }),
              ],
            }),
          ],
        }),

        spacer(120),

        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Participating teams:', bold: true, font: 'Calibri', size: 22, color: BLUE })],
        }),
        bullet('Madina Old Gee'),
        bullet('Oyibi Eagles'),
        bullet('Mambas'),
        bullet('Toronto Vikings'),
        bullet('Traditional Hoopers'),

        spacer(140),

        // Track A sponsorship details table
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [4000, 5386],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  shading: { fill: ORANGE, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 4000, type: WidthType.DXA },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'GAME TITLE SPONSOR', bold: true, font: 'Georgia', size: 22, color: WHITE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'GHS 8,000', bold: true, font: 'Georgia', size: 44, color: WHITE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '"BOST Presents:\nThe Top 4 Fever Game 2026"', font: 'Calibri', size: 18, color: WHITE, italics: true })] }),
                  ],
                }),
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID }, bottom: { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID }, left: { style: BorderStyle.NONE, size: 0, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID } },
                  shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  width: { size: 5386, type: WidthType.DXA },
                  children: [
                    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'What you receive:', bold: true, font: 'Calibri', size: 20, color: BLUE })] }),
                    ...['Event officially named "BOST Presents: The Top 4 Fever Game 2026"',
                       'BOST banners and branding prominently displayed at courtside',
                       'BOST logo on all event flyers, social media posts, and website',
                       'PA / MC acknowledgement of BOST throughout the event',
                       'VIP courtside seats reserved for BOST representatives',
                       'Post-event photo and video package for BOST\'\2 internal use',
                       'Certificate of sponsorship for CSR records',
                    ].map(t => new Paragraph({
                      numbering: { reference: 'bullets', level: 0 },
                      spacing: { after: 60 },
                      children: [new TextRun({ text: t, font: 'Calibri', size: 20 })],
                    })),
                  ],
                }),
              ],
            }),
          ],
        }),

        spacer(320),
        subHeading('TRACK B — Long-Term CSR Partnership (Annual)'),

        bodyPara(
          'For organisations seeking sustained community impact, we offer a two-year minimum institutional partnership. Three tiers are available, each with escalating visibility, engagement, and co-branding rights.',
        ),

        spacer(120),

        // Three-tier table header
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [2746, 2220, 2220, 2200],
          rows: [
            new TableRow({
              children: [
                pkgCell('Partnership Benefits', WHITE, true),
                pkgHeader('BRONZE\nGHS 20,000/yr', 'A0522D'),
                pkgHeader('SILVER\nGHS 40,000/yr', '708090'),
                pkgHeader('GOLD\nGHS 75,000/yr', ORANGE),
              ],
            }),
            ...[
              ['Court naming rights (partial)', '—', '✔', '✔'],
              ['Logo on court signage', '✔', '✔', '✔'],
              ['Logo on team jerseys', '✔', '✔', '✔'],
              ['Social media features (monthly)', '2x/month', '4x/month', 'Weekly'],
              ['Website banner & partner page', '✔', '✔', '✔'],
              ['Title sponsor: 1 event/year', '✔', '✔', '✔'],
              ['Title sponsor: all events/year', '—', '—', '✔'],
              ['Access to CSR impact reports', '✔', '✔', '✔'],
              ['Community outreach co-branding', '—', '✔', '✔'],
              ['Staff/student community access days', '—', '✔', '✔'],
              ['Media kit & photo rights', 'Standard', 'Standard', 'Full'],
              ['Dedicated BOST Tournament', '—', '—', '✔'],
              ['Annual CSR presentation to BOST board', '✔', '✔', '✔'],
            ].map(([feature, b, s, g], i) => {
              const fill = i % 2 === 0 ? GRAY_LIGHT : WHITE;
              return new TableRow({
                children: [
                  pkgCell(feature, fill, true),
                  pkgCell(b, fill),
                  pkgCell(s, fill),
                  pkgCell(g, fill),
                ],
              });
            }),
          ],
        }),

        spacer(160),
        bodyPara(
          'All partnership tiers include an annual CSR impact report submitted to BOST, suitable for BOST\'\2 own CSR documentation and regulatory filings. Custom packages are available upon request.',
        ),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 7 — WHY BOST + CALL TO ACTION
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('Why This Partnership, Why Now'),

        bodyPara(
          'Madina and its surrounding neighbourhoods represent one of the most densely populated and commercially active communities in Greater Accra. BOST already serves these communities through the energy value chain. A visible investment in their social and physical wellbeing through sport is the most direct and human expression of what corporate citizenship means.',
        ),

        subHeading('The Business Case for BOST'),

        bullet('Brand Positioning:', 'Align the BOST brand with youth, energy, aspiration, and community — values that resonate with the working Ghanaian household that BOST serves.'),
        bullet('Community Trust:', 'In communities like Madina, trust is built face-to-face. A tangible investment in the court demonstrates that BOST\'\2 CSR is not performative but genuinely rooted in local need.'),
        bullet('Employee Engagement:', 'Staff access days and court bookings for BOST staff and families create internal goodwill and pride in the organisation\'\2 community role.'),
        bullet('Regulatory & Reporting:', 'Madina Basketball provides verified, documented CSR impact data — directly usable in BOST\'\2 annual report and regulatory CSR disclosures.'),
        bullet('Authentic ESG Narrative:', 'Funding the solar upgrade of Madina Zurak Court gives BOST a tangible, verifiable, and named environmental asset — a "BOST Solar Court" visible to thousands of community members.'),

        spacer(160),
        subHeading('Why Madina Basketball is a Safe Investment'),

        bodyPara(
          'Many sponsorship proposals present ambition. Madina Basketball presents evidence. We have already demonstrated that we can:',
        ),
        bullet('Raise funds: GHS 44,750 mobilised from 18 community donors'),
        bullet('Deliver on time: Full renovation completed in 7 days, court launched within 3 months of inception'),
        bullet('Manage money transparently: Every transaction publicly documented, 20% surplus retained responsibly'),
        bullet('Build community: 150+ registered players, two active teams, 12+ events in under one year'),
        bullet('Think ahead: Invested in solar infrastructure; encountered supplier failure; honest about it; pursuing the right solution — not cutting corners'),

        bodyPara(
          'You are not being asked to fund a dream. You are being asked to invest in something that is already working.',
        ),

        spacer(160),
        divider(ORANGE, 200),

        sectionHeading('Next Steps'),

        bodyPara('We respectfully propose the following path forward:'),

        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 100 },
          children: [new TextRun({ text: 'BOST reviews this proposal and confirms interest — within 14 days of receipt', font: 'Calibri', size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 100 },
          children: [new TextRun({ text: 'Madina Basketball presents to BOST CSR Office — a 30-minute session at your convenience', font: 'Calibri', size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 100 },
          children: [new TextRun({ text: 'Sponsorship agreement signed and activation plan confirmed', font: 'Calibri', size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 100 },
          children: [new TextRun({ text: 'Game sponsorship announced publicly; long-term partnership announced at a community event', font: 'Calibri', size: 22 })],
        }),

        spacer(200),

        // CTA box
        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [9386],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 200, bottom: 200, left: 280, right: 280 },
                  width: { size: 9386, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 120 },
                      children: [new TextRun({ text: 'CONTACT US', bold: true, font: 'Georgia', size: 28, color: YELLOW })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [new TextRun({ text: 'Email:  themadinacourt@gmail.com', font: 'Calibri', size: 22, color: WHITE })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [new TextRun({ text: 'Web:  madinabball.vercel.app', font: 'Calibri', size: 22, color: WHITE })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [new TextRun({ text: 'Ref:  MBK/BOST/CSR/2026/01', font: 'Calibri', size: 20, color: GRAY_MID, italics: true })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),


        // ════════════════════════════════════════════════════════════════════
        // PAGE 8 — APPENDIX
        // ════════════════════════════════════════════════════════════════════

        sectionHeading('Appendix'),

        subHeading('A. Financial Summary'),

        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [5000, 4386],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: 'Item', bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
                }),
                new TableCell({
                  borders: noBorders,
                  shading: { fill: BLUE, type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  width: { size: 4386, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Amount (GHS)', bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
                }),
              ],
            }),
            ...[
              ['Renovation BOQ (approved estimate)', '37,250'],
              ['Total community funds raised', '44,750'],
              ['Number of donors', '18'],
              ['Project surplus (20% reserve)', '7,500'],
              ['Financial documentation available', 'Yes — on request'],
            ].map(([label, val], i) => {
              const fill = i % 2 === 0 ? GRAY_LIGHT : WHITE;
              const bdr = { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID };
              const bdrs = { top: bdr, bottom: bdr, left: bdr, right: bdr };
              return new TableRow({
                children: [
                  new TableCell({ borders: bdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 5000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Calibri', size: 20 })] })] }),
                  new TableCell({ borders: bdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4386, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: val, font: 'Calibri', size: 20, bold: i < 3 })] })] }),
                ],
              });
            }),
          ],
        }),

        spacer(240),
        subHeading('B. Leadership & Executive Committee'),

        new Table({
          width: { size: 9386, type: WidthType.DXA },
          columnWidths: [3200, 3200, 2986],
          rows: [
            new TableRow({
              children: ['Name', 'Role', 'Function'].map((h, i) => new TableCell({
                borders: noBorders,
                shading: { fill: ORANGE, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                width: { size: i === 2 ? 2986 : 3200, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: 'Georgia', size: 20, color: WHITE })] })],
              })),
            }),
            ...[
              ['Shafic & Adam', 'Co-Founders', 'Vision, strategy & community leadership'],
              ['Hisham', 'Executive Committee', 'Operations & coaching'],
              ['Kwame', 'Executive Committee / Coach', 'Training programme lead'],
              ['Titus', 'Executive Committee', 'Community relations'],
              ['Mustafa', 'Executive Committee', 'Logistics & events'],
              ['Lord & Jesse', 'Coaches', 'Player development'],
            ].map(([name, role, fn], i) => {
              const fill = i % 2 === 0 ? GRAY_LIGHT : WHITE;
              const bdr = { style: BorderStyle.SINGLE, size: 1, color: GRAY_MID };
              const bdrs = { top: bdr, bottom: bdr, left: bdr, right: bdr };
              const c = (text, w) => new TableCell({ borders: bdrs, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: w, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text, font: 'Calibri', size: 20 })] })] });
              return new TableRow({ children: [c(name, 3200), c(role, 3200), c(fn, 2986)] });
            }),
          ],
        }),

        spacer(240),
        subHeading('C. Documentation Available on Request'),
        bullet('Complete BOQ and contractor proforma invoice'),
        bullet('Full donor list with amounts (18 named donors)'),
        bullet('Live financial dashboard — accessible at madinabball.vercel.app/transparency'),
        bullet('Before & after renovation photography and video'),
        bullet('Solar installation attempt documentation and proposed specifications for upgrade'),
        bullet('Event photo and media portfolio (June 2025 – present)'),
        bullet('Draft sponsorship agreement template'),

        spacer(240),
        divider(GRAY_MID, 160),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Madina Basketball  —  Libya Quarters, Madina, Accra, Ghana', font: 'Calibri', size: 18, color: GRAY_TEXT, italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: 'madinabball.vercel.app  |  themadinacourt@gmail.com', font: 'Calibri', size: 18, color: GRAY_TEXT })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Ref: MBK/BOST/CSR/2026/01  |  19 May 2026', font: 'Calibri', size: 16, color: GRAY_TEXT, italics: true })],
        }),
      ],
    },
  ],
});

// ─── Write output ─────────────────────────────────────────────────────────────
const outPath = process.argv[2] || 'docs/sponsorship/BOST_Sponsorship_Proposal_MadinaBasketball.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Written:', outPath);
});
