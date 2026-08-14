// extract-manifest.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Pull credentials from GitHub Action Secrets
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("SYS_ERR: Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function extractData() {
    console.log("INITIALIZING OMEGA MIND UPLINK...");
    
    const { data, error } = await supabase
        .from('asset_manifest')
        .select('*')
        .order('index_id', { ascending: true });

    if (error) {
        console.error("SYS_ERR: Extraction failed.", error);
        process.exit(1);
    }

    // Ensure the public directory exists for Vite
    const dir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, 'asset-manifest.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    console.log(`EXTRACTION COMPLETE: ${data.length} assets successfully written to public/asset-manifest.json`);
}

extractData();
