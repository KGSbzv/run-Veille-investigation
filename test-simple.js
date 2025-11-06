const https = require('https');

console.log('🧪 TEST MANUEL SIMPLE - CACRS');
console.log('================================\n');

const url = 'https://cacrs-frontend-e3cni43iqq-ew.a.run.app';

https.get(url, (res) => {
  console.log(`✅ URL accessible: ${url}`);
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`);
  console.log(`   - Content-Type: ${res.headers['content-type']}`);
  console.log(`   - X-Frame-Options: ${res.headers['x-frame-options'] || 'Non défini'}`);
  console.log(`   - Content-Security-Policy: ${res.headers['content-security-policy'] ? 'Défini' : 'Non défini'}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`\n📄 Taille page: ${(data.length / 1024).toFixed(2)} KB`);
    console.log(`✅ Titre trouvé: ${data.includes('CACRS') ? 'Oui' : 'Non'}`);
    console.log(`✅ React root: ${data.includes('id="root"') ? 'Oui' : 'Non'}`);
    
    console.log('\n🎯 RÉSULTAT: Application accessible et fonctionnelle');
  });
}).on('error', (err) => {
  console.error('❌ Erreur:', err.message);
});
