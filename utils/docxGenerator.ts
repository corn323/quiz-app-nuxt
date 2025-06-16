import { Document, Paragraph, TextRun, AlignmentType, Packer, Math, MathRun } from 'docx';
import { saveAs } from 'file-saver';
import { MathfieldElement } from 'mathlive';

const FONT_FAMILY = "標楷體";
const NORMAL_TEXT_SIZE = 24;
const TITLE_TEXT_SIZE = 32;
const HINT_TEXT_SIZE = 20;
const HINT_TEXT_COLOR = "008000";
const ERROR_TEXT_COLOR = "FF0000";
const OPTION_INDENT_LEFT = 720;

if (typeof window !== 'undefined' && !customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement);
}

interface DraggableElement {
  x: number;
  y: number;
  width: number;
  height: number;
  question?: string;
  options?: string[];
  isMath?: boolean;
  text?: string;
}

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function parseLatexToDocxMathComponents(latexString: string): MathRun[] {
  return [new MathRun(latexString)];
}

function createStyledTextRun(text: string, options?: { size?: number; bold?: boolean; color?: string; }): TextRun {
  return new TextRun({
    text,
    size: options?.size ?? NORMAL_TEXT_SIZE,
    bold: options?.bold || false,
    color: options?.color,
    font: FONT_FAMILY,
  });
}

function addQuestionToDoc(questionText: string, index: number, isMath: boolean, docChildren: any[]): void {
  const prefix = `${index + 1}. `;

  if (isMath) {
    try {
      const mathComponents = parseLatexToDocxMathComponents(questionText);
      docChildren.push(
        new Paragraph({
          children: [
            createStyledTextRun(prefix),
            new Math({
              children: mathComponents
            })
          ]
        })
      );
    } catch (error) {
      console.error(`Error processing LaTeX for question ${index + 1}: ${questionText}`, error);
      docChildren.push(
        new Paragraph({
          children: [
            createStyledTextRun(`${prefix}[處理失敗] ${questionText}`, { color: ERROR_TEXT_COLOR })
          ]
        })
      );
    }
  } else {
    docChildren.push(
      new Paragraph({
        children: [
          createStyledTextRun(`${prefix}${questionText}`)
        ]
      })
    );
  }
}

function addOptionToDoc(optionText: string, optionIndex: number, isMath: boolean, docChildren: any[]): void {
  const prefix = `${getOptionLabel(optionIndex)}. `;
  const commonParagraphProps = { indent: { left: OPTION_INDENT_LEFT } };

  if (isMath) {
    try {
      const optionMathComponents = parseLatexToDocxMathComponents(optionText);
      docChildren.push(
        new Paragraph({
          ...commonParagraphProps,
          children: [
            createStyledTextRun(prefix),
            new Math({
              children: optionMathComponents
            })
          ]
        })
      );
    } catch (error) {
      console.error(`Error processing LaTeX for option ${getOptionLabel(optionIndex)}: ${optionText}`, error);
      docChildren.push(
        new Paragraph({
          ...commonParagraphProps,
          children: [
            createStyledTextRun(`${prefix}[處理失敗] ${optionText}`, { color: ERROR_TEXT_COLOR })
          ]
        })
      );
    }
  } else {
    docChildren.push(
      new Paragraph({
        ...commonParagraphProps,
        children: [
          createStyledTextRun(`${prefix}${optionText}`)
        ]
      })
    );
  }
}

export async function generateDocx(items: DraggableElement[], textBoxes: DraggableElement[]) {
  const docChildren: any[] = [];
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        createStyledTextRun("考試試卷", { size: TITLE_TEXT_SIZE, bold: true })
      ]
    }),
    new Paragraph({ children: [new TextRun("")] })
  );

  // --- 提示信息 ---
  docChildren.push(
    new Paragraph({
      children: [
        createStyledTextRun("[提示]：文件中的LaTeX文字目前無法自動轉換成數學方程式，需手動轉換。", {
          size: HINT_TEXT_SIZE,
          bold: true,
          color: HINT_TEXT_COLOR
        }),
        createStyledTextRun("滑鼠靠近該部分後會顯示下拉式選單，點開選單後選取專業即可", {
          size: HINT_TEXT_SIZE,
          bold: true,
          color: HINT_TEXT_COLOR
        })
      ]
    }),
    new Paragraph({ children: [new TextRun("")] })
  );

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.question) {
      addQuestionToDoc(item.question, i, !!item.isMath, docChildren);
    }

    if (item.options) {
      for (let optIndex = 0; optIndex < item.options.length; optIndex++) {
        addOptionToDoc(item.options[optIndex], optIndex, !!item.isMath, docChildren);
      }
    }

    docChildren.push(new Paragraph({ children: [new TextRun("")] }));
  }

  for (const textBox of textBoxes) {
    if (textBox.text) {
      const lines = textBox.text.split('\n');
      for (const line of lines) {
        docChildren.push(
          new Paragraph({
            children: [
              createStyledTextRun(line)
            ]
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'exam.docx');
  });
}