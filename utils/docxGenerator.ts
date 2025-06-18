import { Document, Paragraph, TextRun, AlignmentType, Packer, MathRun } from 'docx';
import { saveAs } from 'file-saver';
import { MathfieldElement } from 'mathlive';
import { convertMathExpression } from './mathUtils';

const FONT_FAMILY = "標楷體";
const NORMAL_TEXT_SIZE = 24;
const TITLE_TEXT_SIZE = 32;
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

async function parseLatexToDocxMathComponents(latexString: string): Promise<(TextRun | MathRun)[]> {
  try {

    const convertedMath = await convertMathExpression(latexString, false);

    const mathRun = new MathRun(convertedMath);

    return [mathRun];

  } catch (error) {
    console.warn('Math conversion failed, using original LaTeX:', error);
    return [new TextRun({
      text: latexString,
      size: NORMAL_TEXT_SIZE,
      font: FONT_FAMILY,
      color: ERROR_TEXT_COLOR
    })];
  }
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

async function addQuestionToDoc(questionText: string, index: number, isMath: boolean, docChildren: any[]): Promise<void> {
  const prefix = `${index + 1}. `;

  if (isMath) {
    try {
      const mathComponents = await parseLatexToDocxMathComponents(questionText);
      docChildren.push(
        new Paragraph({
          children: [
            createStyledTextRun(prefix),
            ...mathComponents
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

async function addOptionToDoc(optionText: string, optionIndex: number, isMath: boolean, docChildren: any[]): Promise<void> {
  const prefix = `${getOptionLabel(optionIndex)}. `;
  const commonParagraphProps = { indent: { left: OPTION_INDENT_LEFT } };

  if (isMath) {
    try {
      const optionMathComponents = await parseLatexToDocxMathComponents(optionText);
      docChildren.push(
        new Paragraph({
          ...commonParagraphProps,
          children: [
            createStyledTextRun(prefix),
            ...optionMathComponents
          ]
        })
      );
    } catch (error) {
      console.error(`Error processing LaTeX for option ${optionIndex + 1}: ${optionText}`, error);
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

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.question) {
      await addQuestionToDoc(item.question, i, !!item.isMath, docChildren);
    }

    if (item.options) {
      for (let optIndex = 0; optIndex < item.options.length; optIndex++) {
        await addOptionToDoc(item.options[optIndex], optIndex, !!item.isMath, docChildren);
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

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'exam.docx');
    console.log('文件生成成功');
  } catch (error) {
    console.error('文件生成失敗:', error);
    throw error;
  }
}