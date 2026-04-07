const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3000;
const POSTS_DIR = path.join(__dirname, 'source', '_posts');

app.use(cors());
app.use(express.json());

// 辅助函数：执行 Hexo 生成
function generateHexo() {
    return new Promise((resolve, reject) => {
        exec('npx hexo generate', (error, stdout, stderr) => {
            if (error) {
                console.error(`Hexo generate error: ${error}`);
                return reject(error);
            }
            console.log('Hexo site generated successfully');
            resolve(stdout);
        });
    });
}

// 获取所有文章
app.get('/api/posts', async (req, res) => {
    try {
        const files = await fs.readdir(POSTS_DIR);
        const posts = await Promise.all(files.filter(f => f.endsWith('.md')).map(async file => {
            const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
            // 简单的 Front-matter 解析
            const match = content.match(/^---([\s\S]*?)---([\s\S]*)$/);
            if (!match) return { title: file, content: content };
            
            const frontMatter = {};
            match[1].split('\\n').forEach(line => {
                const [key, ...val] = line.split(':');
                if (key && val) frontMatter[key.trim()] = val.join(':').trim();
            });
            
            return {
                id: file,
                title: frontMatter.title || file,
                content: match[2],
                categories: frontMatter.categories ? [frontMatter.categories] : [],
                tags: frontMatter.tags ? frontMatter.tags.split(',').map(t => t.trim()) : [],
                cover: frontMatter.cover || '',
                excerpt: frontMatter.description || '',
                publishedAt: frontMatter.date || new Date().toISOString()
            };
        }));
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 发布/更新文章
app.post('/api/posts', async (req, res) => {
    try {
        const { id, title, content, categories, tags, cover, excerpt, publishedAt } = req.body;
        const fileName = id ? `${id}.md` : `${Date.now()}.md`;
        const filePath = path.join(POSTS_DIR, fileName);
        
        const frontMatter = [
            '---',
            `title: ${title}`,
            `date: ${publishedAt || new Date().toISOString()}`,
            `categories: ${categories ? categories[0] : ''}`,
            `tags: ${tags ? tags.join(', ') : ''}`,
            `cover: ${cover || ''}`,
            `description: ${excerpt || ''}`,
            '---',
            '',
            content,
            ''
        ].join('\\n');
        
        await fs.writeFile(filePath, frontMatter);
        await generateHexo();
        
        res.json({ success: true, id: fileName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除文章
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const filePath = path.join(POSTS_DIR, `${req.params.id}.md`);
        await fs.remove(filePath);
        await generateHexo();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Admin server running at http://localhost:${PORT}`);
});
