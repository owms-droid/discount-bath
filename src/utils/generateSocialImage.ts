import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import path from 'path';

interface SocialImageOptions {
    title: string;
    description: string;
    outputPath: string;
    width?: number;
    height?: number;
    bgColor?: string;
}

export async function generateSocialImage({
    title,
    description,
    outputPath,
    width = 1200,
    height = 630,
    bgColor = '#0f4b40'
}: SocialImageOptions): Promise<void> {
    // Ensure the output path has a valid extension
    const ext = path.extname(outputPath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        outputPath = outputPath + '.png';
    }

    let browser: Browser | null = null;
    try {
        browser = await puppeteer.launch({
            headless: true // Run in headless mode
        });
        const page = await browser.newPage();

        await page.setViewport({
            width,
            height,
            deviceScaleFactor: 2 // For better quality
        });

        // Generate HTML for the social card
        const html = `
            <html>
                <head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
                    <style>
                        body { 
                            margin: 0; 
                            font-family: 'Inter', system-ui, -apple-system, sans-serif;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .card {
                            width: ${width}px;
                            height: ${height}px;
                            background: ${bgColor};
                            color: white;
                            padding: 60px;
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }
                        h1 {
                            font-size: 68px;
                            margin: 0 0 20px;
                            line-height: 1.1;
                            font-weight: bold;
                        }
                        p {
                            font-size: 36px;
                            margin: 0;
                            opacity: 0.9;
                            line-height: 1.4;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>${title}</h1>
                        <p>${description}</p>
                    </div>
                </body>
            </html>
        `;

        await page.setContent(html);

        // Take screenshot
        await page.screenshot({
            path: outputPath as `${string}.png` | `${string}.jpeg` | `${string}.webp`,
            type: path.extname(outputPath).replace('.', '') as 'png' | 'jpeg' | 'webp',
            quality: ext === '.webp' ? 90 : 100
        });
    } catch (error) {
        console.error('Error generating social image:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}