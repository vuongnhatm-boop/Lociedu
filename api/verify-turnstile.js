/**
 * Cloudflare Turnstile Server-Side Verification Endpoint
 * Validates the Turnstile response token against Cloudflare's siteverify API.
 * Prevents DDoS and automated bot attacks on Loci Edu.
 */

module.exports = async (req, res) => {
    // 1. CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Parse incoming body
        let token = '';
        if (typeof req.body === 'string') {
            try {
                const parsed = JSON.parse(req.body);
                token = parsed.token || parsed.response;
            } catch (_) {
                token = req.body;
            }
        } else if (req.body && typeof req.body === 'object') {
            token = req.body.token || req.body.response;
        }

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu mã xác thực Turnstile (Missing token)'
            });
        }

        // Secret key from environment variable or encoded fallback
        const primarySecret = process.env.TURNSTILE_SECRET_KEY ||
            Buffer.from('MHg0QUFBQUFBQUYxMmphMGtqVUFCUEo4N2dnMFU5ck1WdGVZ', 'base64').toString('utf-8');
        const secondarySecret = Buffer.from('MHg0QUFBQUFBQUYxMmpBMGtqVUFCUEo4N2dnMFU5ck1WdGVZ', 'base64').toString('utf-8');

        // Function to call Cloudflare siteverify
        const verifyWithSecret = async (secretKey) => {
            const formData = new URLSearchParams();
            formData.append('secret', secretKey);
            formData.append('response', token);
            if (req.headers['x-forwarded-for']) {
                formData.append('remoteip', req.headers['x-forwarded-for'].split(',')[0].trim());
            }

            const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
            return await cfRes.json();
        };

        let result = await verifyWithSecret(primarySecret);

        // If primary had secret issue and secondary exists, try secondary fallback
        if (!result.success && result['error-codes'] && result['error-codes'].includes('invalid-input-secret')) {
            try {
                const retryResult = await verifyWithSecret(secondarySecret);
                if (retryResult.success || !retryResult['error-codes'].includes('invalid-input-secret')) {
                    result = retryResult;
                }
            } catch (_) {}
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('Turnstile verification error:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Lỗi hệ thống xác thực Turnstile'
        });
    }
};
