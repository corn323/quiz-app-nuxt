import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { MathfieldElement } from 'mathlive';

// 引入 MathfieldElement 並註冊，確保在 SSR 環境下不會出錯
// 這一部分只在瀏覽器端運行才有意義
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

// 輔助函式：將 LaTeX 轉換為 MathML
// 注意：此函式在 Node.js 環境下會直接返回原始 LaTeX 字串
async function latexToMathML(latexString: string): Promise<string> {
  // 僅在客戶端執行 MathfieldElement 相關操作
  if (typeof window === 'undefined') {
    // 在 SSR 或 Node.js 環境下，直接返回原始 LaTeX，因為無法渲染 MathfieldElement
    console.warn("latexToMathML called on server side, returning original LaTeX string.");
    return latexString;
  }
  try {
    const mf = new MathfieldElement();
    mf.value = latexString;
    // 等待 MathLive 內部渲染完成，確保 toMathML 返回正確結果
    // 使用 requestAnimationFrame 或小的 setTimeout
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    // 這裡仍然返回 MathML，但請注意 Word 顯示 MathML 作為普通文本的限制
    return mf.getValue('math-ml');
  } catch (error) {
    console.warn("Error converting LaTeX to MathML, returning original LaTeX:", error);
    // 如果轉換失敗，也返回原始 LaTeX，以便用戶可以手動轉換
    return latexString;
  }
}

// 輔助函式：獲取選項標籤 (A, B, C...)
function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index); // A, B, C...
}

export async function generateDocx(items: DraggableElement[], textBoxes: DraggableElement[]) {
  const docChildren = [];

  // 標題 (不變)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "考試試卷",
          size: 32, // 16pt * 2
          bold: true,
          font: "標楷體" // 使用常見中文字體
        })
      ]
    }),
    new Paragraph({ children: [new TextRun("")] }) // 空行
  );

  // 提示使用者如何轉換數學方程式 (不變)
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "提示：文件中的數學方程式是以純文本（LaTeX或MathML）格式呈現。",
          size: 20, // 10pt * 2
          bold: true,
          color: "FF0000", // 紅色
          font: "標楷體"
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "若要編輯，請選取數學方程式文本，然後在Word中點擊「插入」->「方程式」，或選擇方程式後點擊「轉換」->「專業」。",
          size: 20,
          color: "FF0000",
          font: "標楷體"
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun("")] })
  );

  // 生成題目
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 處理題目本身
    if (item.isMath && item.question) {
      // 這裡直接使用原始的 LaTeX 字串，而不是嘗試轉換為 MathML
      // 這樣在 Word 中至少可以看到 LaTeX 語法，而不是空白或不顯示
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${i + 1}. `, size: 24, font: "標楷體" }),
            new TextRun({
              text: item.question, // 直接使用原始的 LaTeX 字串
              size: 24,
              font: "Cambria Math" // 仍可使用此字體以嘗試更好的排版，但不會自動轉換
            })
          ],
        })
      );
    } else if (item.question) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${item.question}`,
              size: 24,
              font: "標楷體"
            })
          ]
        })
      );
    }

    // 處理選項
    if (item.options) {
      for (let optIndex = 0; optIndex < item.options.length; optIndex++) {
        const option = item.options[optIndex];
        if (item.isMath) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${getOptionLabel(optIndex)}. `, size: 24, font: "標楷體" }),
                new TextRun({
                  text: option, // 直接使用原始的 LaTeX 字串
                  size: 24,
                  font: "Cambria Math"
                })
              ],
              indent: { left: 720 }
            })
          );
        } else {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${getOptionLabel(optIndex)}. ${option}`,
                  size: 24,
                  font: "標楷體"
                })
              ],
              indent: { left: 720 }
            })
          );
        }
      }
    }
    docChildren.push(new Paragraph({ children: [new TextRun("")] })); // 題目間空行
  }

  // 處理文本框內容 (不變)
  textBoxes.forEach(textBox => {
    if (textBox.text) {
      const lines = textBox.text.split('\n');
      lines.forEach(line => {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24,
                font: "標楷體"
              })
            ]
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  // 生成並下載文件 (不變)
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'exam.docx');
  });
}