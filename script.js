// Color Thief instance
const colorThief = new ColorThief();
let currentPrimaryColor = '#2563eb';
let currentPrimaryColorDark = '#1d4ed8';
let uploadedImageData = null;

// Update CSS custom properties for theming
function updateTheme(primaryColor, darkColor = null) {
    const root = document.documentElement;
    
    if (!darkColor) {
        const rgb = hexToRgb(primaryColor);
        const darker = darkenColor(rgb, 0.2);
        darkColor = rgbToHex(darker);
    }
    
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-color-dark', darkColor);
    
    currentPrimaryColor = primaryColor;
    currentPrimaryColorDark = darkColor;
    
    document.getElementById('themeIndicator').textContent = 
        `Current theme: ${primaryColor} (auto-matched from logo)`;
}

// Color utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

function darkenColor(rgb, factor) {
    return {
        r: Math.floor(rgb.r * (1 - factor)),
        g: Math.floor(rgb.g * (1 - factor)),
        b: Math.floor(rgb.b * (1 - factor))
    };
}

function rgbArrayToHex(rgbArray) {
    return "#" + rgbArray.map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
}

// Extract colors from logo and create palette
function extractColors(imgElement) {
    try {
        const dominantColor = colorThief.getColor(imgElement);
        const dominantHex = rgbArrayToHex(dominantColor);
        const palette = colorThief.getPalette(imgElement, 6);
        
        const colorSwatches = document.getElementById('colorSwatches');
        const colorPalette = document.getElementById('colorPalette');
        
        colorSwatches.innerHTML = '';
        
        // Add dominant color first
        const dominantSwatch = createColorSwatch(dominantColor, true);
        colorSwatches.appendChild(dominantSwatch);
        
        // Add palette colors
        palette.forEach((color, index) => {
            if (index > 0) {
                const swatch = createColorSwatch(color, false);
                colorSwatches.appendChild(swatch);
            }
        });
        
        colorPalette.style.display = 'block';
        updateTheme(dominantHex);
        
    } catch (error) {
        console.log('Color extraction error:', error);
    }
}

// Create color swatch element
function createColorSwatch(rgbArray, isSelected = false) {
    const hex = rgbArrayToHex(rgbArray);
    const swatch = document.createElement('div');
    swatch.className = `color-swatch ${isSelected ? 'selected' : ''}`;
    swatch.style.backgroundColor = hex;
    swatch.setAttribute('data-hex', hex);
    
    swatch.addEventListener('click', function() {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        updateTheme(hex);
    });
    
    return swatch;
}

// Generate complete SmartLinks code with proper logo handling
function generateSmartLinksCode() {
    const businessName = document.getElementById('businessName').value || 'Your Business';
    const businessTagline = document.getElementById('businessTagline').value || 'Your tagline';
    const businessUrl = document.getElementById('businessUrl').value || 'https://yourbusiness.com';
    const aboutBusiness = document.getElementById('aboutBusiness').value || 'About your business';
    const services = document.getElementById('services').value || 'Your services';
    const serviceAreas = document.getElementById('serviceAreas').value || 'Your service areas';
    const phone = document.getElementById('phone').value || 'Your phone';
    const emergency = document.getElementById('emergency').value || 'Your hours';
    const logoUrl = document.getElementById('logoUrl').value;
    
    // Determine logo display method
    let logoHtml, showLogoWarning;
    if (logoUrl && logoUrl.trim()) {
        // Use provided logo URL
        logoHtml = `<img src="${logoUrl}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" alt="${businessName} logo">`;
        showLogoWarning = false;
    } else if (uploadedImageData) {
        // Show placeholder with warning
        logoHtml = `<img src="LOGO-URL-HERE" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" alt="${businessName} logo">`;
        showLogoWarning = true;
    } else {
        // Use business initials
        logoHtml = businessName.split(' ').map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase();
        showLogoWarning = false;
    }

    const servicesList = services.split('\n').filter(line => line.trim());
    const servicesHtml = servicesList.length > 0 
        ? servicesList.map(service => `                    <li>${service.replace(/^[•\-\*]\s*/, '')}</li>`).join('\n')
        : '                    <li>Your services here</li>';

    // Show/hide logo warning
    const logoWarningElement = document.getElementById('logoWarning');
    if (logoWarningElement) {
        logoWarningElement.style.display = showLogoWarning ? 'block' : 'none';
    }

    return `<!-- SmartLinks by iTabs - ${businessName} -->
<style>
.smartlinks-widget {
    max-width: 600px;
    margin: 20px auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: white;
}
.smartlinks-header {
    background: ${currentPrimaryColor};
    color: white;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}
.smartlinks-logo {
    width: 60px;
    height: 60px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: ${currentPrimaryColor};
    font-weight: bold;
}
.smartlinks-business-info h3 {
    font-size: 18px;
    margin: 0 0 5px 0;
}
.smartlinks-business-info p {
    opacity: 0.9;
    font-size: 14px;
    margin: 0;
}
.smartlinks-tabs {
    display: flex;
    background: #f1f5f9;
    overflow-x: auto;
}
.smartlinks-tab {
    padding: 12px 16px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: #64748b;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    min-width: 80px;
    text-align: center;
    transition: all 0.3s ease;
}
.smartlinks-tab.active {
    color: ${currentPrimaryColor};
    border-bottom-color: ${currentPrimaryColor};
    background: white;
}
.smartlinks-tab:hover {
    color: ${currentPrimaryColor};
}
.smartlinks-content {
    padding: 20px;
    min-height: 200px;
}
.smartlinks-tab-content {
    display: none;
}
.smartlinks-tab-content.active {
    display: block;
}
.smartlinks-tab-content h4 {
    color: #1f2937;
    margin-bottom: 15px;
    font-size: 16px;
}
.smartlinks-tab-content p {
    color: #4b5563;
    margin-bottom: 10px;
    line-height: 1.6;
}
.smartlinks-tab-content ul {
    color: #4b5563;
    padding-left: 20px;
    margin: 0;
}
.smartlinks-tab-content li {
    margin-bottom: 8px;
}
@media (max-width: 600px) {
    .smartlinks-widget { margin: 10px; }
    .smartlinks-header { padding: 15px; }
    .smartlinks-logo { width: 50px; height: 50px; font-size: 20px; }
    .smartlinks-business-info h3 { font-size: 16px; }
    .smartlinks-tab { padding: 10px 12px; font-size: 14px; }
}
</style>

<div class="smartlinks-widget">
    <div class="smartlinks-header">
        <div class="smartlinks-logo">${logoHtml}</div>
        <div class="smartlinks-business-info">
            <h3>${businessName}</h3>
            <p>${businessTagline}</p>
        </div>
    </div>
    
    <div class="smartlinks-tabs">
        <button class="smartlinks-tab active" onclick="showSmartLinksTab(this, 'about')">About</button>
        <button class="smartlinks-tab" onclick="showSmartLinksTab(this, 'services')">Services</button>
        <button class="smartlinks-tab" onclick="showSmartLinksTab(this, 'areas')">Areas</button>
        <button class="smartlinks-tab" onclick="showSmartLinksTab(this, 'contact')">Contact</button>
    </div>
    
    <div class="smartlinks-content">
        <div class="smartlinks-tab-content active" id="about">
            <h4>About Our Business</h4>
            <p>${aboutBusiness}</p>
        </div>
        
        <div class="smartlinks-tab-content" id="services">
            <h4>Our Services</h4>
            <ul>
${servicesHtml}
            </ul>
        </div>
        
        <div class="smartlinks-tab-content" id="areas">
            <h4>Service Areas</h4>
            <p>${serviceAreas}</p>
            <p><strong>Emergency Response:</strong> We aim to reach emergency calls within 60 minutes across all service areas.</p>
        </div>
        
        <div class="smartlinks-tab-content" id="contact">
            <h4>Get In Touch</h4>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Emergency:</strong> ${emergency}</p>
            <p><strong>Response Time:</strong> Usually within 60 minutes for emergencies</p>
            <p><strong>Areas:</strong> ${serviceAreas}</p>
        </div>
    </div>
</div>

<script>
function showSmartLinksTab(tabElement, tabName) {
    var widget = tabElement.closest('.smartlinks-widget');
    widget.querySelectorAll('.smartlinks-tab').forEach(tab => tab.classList.remove('active'));
    widget.querySelectorAll('.smartlinks-tab-content').forEach(content => content.classList.remove('active'));
    tabElement.classList.add('active');
    widget.querySelector('#' + tabName).classList.add('active');
}
</script>`;
}

// Generate metadata
function generateMetadata() {
    const businessName = document.getElementById('businessName').value || 'Your Business';
    const businessTagline = document.getElementById('businessTagline').value || 'Your tagline';
    const businessUrl = document.getElementById('businessUrl').value || 'https://yourbusiness.com';
    const aboutBusiness = document.getElementById('aboutBusiness').value || 'About your business';
    const phone = document.getElementById('phone').value || 'Your phone';
    
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="business.business">
<meta property="og:url" content="${businessUrl}">
<meta property="og:title" content="${businessName}">
<meta property="og:description" content="${businessTagline}">
<meta property="og:site_name" content="${businessName}">
<meta property="og:locale" content="en_AU">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${businessName}">
<meta name="twitter:description" content="${businessTagline}">
<meta name="twitter:url" content="${businessUrl}">

<!-- Schema.org for Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${businessName}",
  "description": "${aboutBusiness}",
  "url": "${businessUrl}",
  "telephone": "${phone}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Perth",
    "addressRegion": "WA",
    "addressCountry": "AU"
  }
}
</script>`;
}

// Generate social media posts
function generateSocialPosts() {
    const businessName = document.getElementById('businessName').value || 'Your Business';
    const businessTagline = document.getElementById('businessTagline').value || 'Your tagline';
    const businessUrl = document.getElementById('businessUrl').value || 'https://yourbusiness.com';
    const phone = document.getElementById('phone').value || 'Your phone';
    
    return {
        linkedin: `🔧 Looking for reliable plumbing services in Perth?

${businessName} - ${businessTagline}

✅ Transparent pricing, no hidden costs
✅ Licensed & insured professionals  
✅ Emergency services available
✅ Serving Perth metro area

Contact us: ${phone}
Visit: ${businessUrl}

#PerthPlumbing #LocalBusiness #FairPricing #PlumbingServices`,

        facebook: `🚰 Need a plumber you can trust?

${businessName} is here to help with honest, reliable plumbing services across Perth.

${businessTagline}

📞 Call us: ${phone}
🌐 Visit: ${businessUrl}

#PerthPlumbing #LocalPlumber #FairPrices`,

        twitter: `🔧 ${businessName} - ${businessTagline}

Honest plumbing services in Perth
📞 ${phone}
🌐 ${businessUrl}

#PerthPlumbing #LocalBusiness`
    };
}

// Update preview in real-time
function updatePreview() {
    const businessName = document.getElementById('businessName').value;
    const businessTagline = document.getElementById('businessTagline').value;
    const businessUrl = document.getElementById('businessUrl').value;
    const aboutBusiness = document.getElementById('aboutBusiness').value;
    const services = document.getElementById('services').value;
    const serviceAreas = document.getElementById('serviceAreas').value;
    const phone = document.getElementById('phone').value;
    const emergency = document.getElementById('emergency').value;

    document.getElementById('previewName').textContent = businessName || 'Your Business Name';
    document.getElementById('previewTagline').textContent = businessTagline || 'Your business tagline';
    document.getElementById('previewAbout').textContent = aboutBusiness || 'Tell customers about your business';
    document.getElementById('previewAreas').textContent = serviceAreas || 'Your service areas';
    document.getElementById('previewPhone').textContent = phone || 'Your phone number';
    document.getElementById('previewEmergency').textContent = emergency || 'Your emergency hours';
    document.getElementById('previewContactAreas').textContent = serviceAreas || 'Your service areas';

    // Update metadata preview
    document.getElementById('metaPreviewTitle').textContent = businessName || 'Your Business';
    document.getElementById('metaPreviewDesc').textContent = businessTagline || 'Your tagline';
    document.getElementById('metaPreviewUrl').textContent = businessUrl.replace(/^https?:\/\//, '') || 'yourbusiness.com';

    const words = businessName.split(' ');
    const initials = words.map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase();
    if (!document.querySelector('#previewLogo img')) {
        document.getElementById('previewLogo').textContent = initials || 'YB';
    }

    const servicesList = services.split('\n').filter(line => line.trim());
    const servicesHTML = servicesList.length > 0 
        ? '<ul>' + servicesList.map(service => `<li>${service.replace(/^[•\-\*]\s*/, '')}</li>`).join('') + '</ul>'
        : '<p>List your services here</p>';
    document.getElementById('previewServices').innerHTML = servicesHTML;
}

// Tab switching functions
function showTab(tabName) {
    document.querySelectorAll('.smartlinks-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.smartlinks-tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function showCodeTab(tabName) {
    document.querySelectorAll('.code-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.code-section').forEach(section => section.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Modal functions
function openCodeModal() {
    // Generate all code and content
    const embedCode = generateSmartLinksCode();
    const metadataCode = generateMetadata();
    const socialPosts = generateSocialPosts();
    
    document.getElementById('embedCode').textContent = embedCode;
    document.getElementById('metadataCode').textContent = metadataCode;
    document.getElementById('linkedinPost').textContent = socialPosts.linkedin;
    document.getElementById('facebookPost').textContent = socialPosts.facebook;
    document.getElementById('twitterPost').textContent = socialPosts.twitter;
    
    document.getElementById('codeModal').style.display = 'block';
}

function closeCodeModal() {
    document.getElementById('codeModal').style.display = 'none';
}

// Copy to clipboard function
function copyCode(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const button = element.parentNode.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const button = element.parentNode.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 2000);
    });
}

// Logo upload handling
document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageData = e.target.result;
            const logoPreview = document.getElementById('logoPreview');
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "Logo preview";
            img.style.maxWidth = '120px';
            img.style.maxHeight = '80px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            logoPreview.innerHTML = '';
            logoPreview.appendChild(img);
            
            // Show logo URL input
            document.getElementById('logoUrlGroup').style.display = 'block';
            
            // Update preview with uploaded image
            document.getElementById('previewLogo').innerHTML = 
                `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">`;
            
            img.onload = function() {
                extractColors(this);
            };
        };
        reader.readAsDataURL(file);
    }
});

// Reset form
function resetForm() {
    document.getElementById('businessName').value = 'Fair Price Plumbing';
    document.getElementById('businessTagline').value = 'Quality Plumbing at Fair Prices - Licensed & Insured';
    document.getElementById('businessUrl').value = 'https://fairpriceplumbing.com.au';
    document.getElementById('aboutBusiness').value = 'Fair Price Plumbing provides honest, reliable plumbing services across Perth. We believe in transparent pricing with no hidden costs. Family-owned business with over 10 years experience serving residential and commercial customers.';
    document.getElementById('services').value = '• Emergency plumbing repairs\n• Blocked drain clearing\n• Hot water system repairs & installation\n• Burst pipe repairs\n• Tap and toilet repairs\n• Gas plumbing services\n• Commercial plumbing';
    document.getElementById('serviceAreas').value = 'Perth Metro, Fremantle, Rockingham, Joondalup';
    document.getElementById('phone').value = '0400 123 456';
    document.getElementById('emergency').value = '24/7 Emergency Service Available';
    document.getElementById('logoUrl').value = '';
    
    document.getElementById('logoPreview').innerHTML = '';
    document.getElementById('previewLogo').innerHTML = 'FPP';
    document.getElementById('colorPalette').style.display = 'none';
    document.getElementById('logoUrlGroup').style.display = 'none';
    uploadedImageData = null;
    
    updateTheme('#2563eb', '#1d4ed8');
    document.getElementById('themeIndicator').textContent = 'Current theme: Default Blue (#2563eb)';
    
    updatePreview();
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('codeModal')) {
        closeCodeModal();
    }
});

// Add event listeners for real-time updates
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('businessName').addEventListener('input', updatePreview);
    document.getElementById('businessTagline').addEventListener('input', updatePreview);
    document.getElementById('businessUrl').addEventListener('input', updatePreview);
    document.getElementById('aboutBusiness').addEventListener('input', updatePreview);
    document.getElementById('services').addEventListener('input', updatePreview);
    document.getElementById('serviceAreas').addEventListener('input', updatePreview);
    document.getElementById('phone').addEventListener('input', updatePreview);
    document.getElementById('emergency').addEventListener('input', updatePreview);

    // Initialize preview
    updatePreview();
});
