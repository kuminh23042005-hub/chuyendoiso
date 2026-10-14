/**
 * CV Template - JavaScript Functionality
 * Features: Avatar upload, PDF download, Print, Content editing
 */

// ========================================
// Avatar Upload Handler
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImg = document.getElementById('avatar');

    if (avatarInput && avatarImg) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Vui lòng chọn file ảnh (JPG, PNG, WebP)');
                    return;
                }

                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarImg.src = e.target.result;
                    // Save to localStorage for persistence
                    localStorage.setItem('cv-avatar', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved avatar from localStorage
        const savedAvatar = localStorage.getItem('cv-avatar');
        if (savedAvatar) {
            avatarImg.src = savedAvatar;
        }
    }

    // ========================================
    // Content Editable - Auto Save
    // ========================================
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => {
        // Load saved content
        const key = 'cv-' + getElementPath(el);
        const saved = localStorage.getItem(key);
        if (saved) {
            el.innerHTML = saved;
        }

        // Save on blur
        el.addEventListener('blur', function() {
            localStorage.setItem(key, this.innerHTML);
        });

        // Save on Enter (for single-line elements)
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                const tagName = this.tagName.toLowerCase();
                if (['h1', 'h2', 'h3', 'p', 'span', 'time'].includes(tagName)) {
                    e.preventDefault();
                    this.blur();
                }
            }
        });
    });

    // ========================================
    // Keyboard Shortcuts
    // ========================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S: Save/Download PDF
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadPDF();
        }
        // Ctrl/Cmd + P: Print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printCV();
        }
        // Ctrl/Cmd + R: Reset (with Shift to prevent browser reload)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
            e.preventDefault();
            resetContent();
        }
    });

    // ========================================
    // Smooth scroll for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ========================================
// Helper: Get unique path for element
// ========================================
function getElementPath(el) {
    let path = '';
    while (el && el !== document.body) {
        let selector = el.tagName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path = selector + ' > ' + path;
            break;
        } else {
            let sibling = el;
            let nth = 1;
            while (sibling = sibling.previousElementSibling) {
                if (sibling.tagName === el.tagName) nth++;
            }
            if (nth > 1) selector += ':nth-of-type(' + nth + ')';
        }
        path = selector + ' > ' + path;
        el = el.parentElement;
    }
    return path.replace(/ > $/, '');
}

// ========================================
// Download as PDF
// ========================================
function downloadPDF() {
    // Show loading state
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';
    btn.disabled = true;

    // Use html2canvas + jsPDF if available, otherwise fallback to print
    if (typeof html2canvas !== 'undefined' && typeof jsPDF !== 'undefined') {
        generatePDFWithLibrary();
    } else {
        // Fallback: Load libraries dynamically
        loadPDFLibraries().then(() => {
            generatePDFWithLibrary();
        }).catch(() => {
            // Ultimate fallback: Print dialog
            alert('Để tải PDF, vui lòng sử dụng chức năng In (Ctrl+P) và chọn "Lưu dưới dạng PDF"');
            printCV();
        });
    }

    function generatePDFWithLibrary() {
        const cvContainer = document.querySelector('.cv-container');

        // Hide action bar for PDF
        const actionBar = document.querySelector('.action-bar');
        actionBar.style.display = 'none';

        html2canvas(cvContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 5;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('CV_' + getFileName() + '.pdf');

            // Restore action bar
            actionBar.style.display = 'flex';
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }
}

// ========================================
// Load PDF Libraries Dynamically
// ========================================
function loadPDFLibraries() {
    return new Promise((resolve, reject) => {
        // Load html2canvas
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script1.onload = () => {
            // Load jsPDF
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script2.onload = () => {
                window.jsPDF = window.jspdf.jsPDF;
                resolve();
            };
            script2.onerror = reject;
            document.head.appendChild(script2);
        };
        script1.onerror = reject;
        document.head.appendChild(script1);
    });
}

// ========================================
// Print CV
// ========================================
function printCV() {
    // Hide action bar before print
    const actionBar = document.querySelector('.action-bar');
    actionBar.style.display = 'none';

    // Small delay to ensure DOM updates
    setTimeout(() => {
        window.print();
        // Show action bar after print dialog closes
        setTimeout(() => {
            actionBar.style.display = 'flex';
        }, 500);
    }, 100);
}

// ========================================
// Reset Content to Template
// ========================================
function resetContent() {
    if (!confirm('Bạn có chắc muốn khôi phục nội dung mẫu? Tất cả thông tin đã nhập sẽ bị xóa.')) {
        return;
    }

    // Clear localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cv-')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Reload page
    window.location.reload();
}

// ========================================
// Get filename for PDF
// ========================================
function getFileName() {
    const nameEl = document.querySelector('.name');
    let name = 'CV';
    if (nameEl && nameEl.textContent.trim() && nameEl.textContent.trim() !== '[Họ và Tên]') {
        name = nameEl.textContent.trim().replace(/[^a-zA-Z0-9À-ɏḀ-ỿ\s-]/g, '').replace(/\s+/g, '_');
    }
    const date = new Date().toISOString().split('T')[0];
    return name + '_' + date;
}

// ========================================
// Add new experience item
// ========================================
function addExperience() {
    const list = document.querySelector('.experience-list');
    const template = `
        <article class="experience-item" contenteditable="true">
            <header class="experience-header">
                <div>
                    <h3 class="job-title">[Vị trí công việc]</h3>
                    <p class="company">[Tên công ty]</p>
                </div>
                <time class="date" datetime="2024-01">[Tháng/Năm] - [Tháng/Năm]</time>
            </header>
            <ul class="job-description">
                <li>[Mô tả thành tựu chính]</li>
                <li>[Mô tả trách nhiệm chính]</li>
            </ul>
            <div class="tech-stack">
                <span class="tech-tag">[Công nghệ]</span>
            </div>
        </article>
    `;
    list.insertAdjacentHTML('beforeend', template);
    setupEditable(list.lastElementChild);
}

// ========================================
// Add new project item
// ========================================
function addProject() {
    const list = document.querySelector('.projects-list');
    const template = `
        <article class="project-item" contenteditable="true">
            <h3>[Tên dự án]</h3>
            <p class="project-desc">[Mô tả dự án]</p>
            <div class="project-links">
                <a href="#" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>
                <a href="#" target="_blank"><i class="fab fa-github"></i> Code</a>
            </div>
            <div class="project-tech">
                <span class="tech-tag">[Tech]</span>
            </div>
        </article>
    `;
    list.insertAdjacentHTML('beforeend', template);
    setupEditable(list.lastElementChild);
}

// ========================================
// Setup editable for new elements
// ========================================
function setupEditable(container) {
    const editables = container.querySelectorAll('[contenteditable="true"]');
    editables.forEach(el => {
        el.addEventListener('blur', function() {
            const key = 'cv-' + getElementPath(this);
            localStorage.setItem(key, this.innerHTML);
        });
    });
}

// ========================================
// Export/Import Data (JSON)
// ========================================
function exportData() {
    const data = {};
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        const key = getElementPath(el);
        data[key] = el.innerHTML;
    });
    // Also save avatar
    const avatar = document.getElementById('avatar');
    if (avatar && avatar.src && !avatar.src.includes('placeholder')) {
        data['avatar'] = avatar.src;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data_' + getFileName() + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            Object.keys(data).forEach(key => {
                if (key === 'avatar') {
                    const avatar = document.getElementById('avatar');
                    if (avatar) {
                        avatar.src = data[key];
                        localStorage.setItem('cv-avatar', data[key]);
                    }
                } else {
                    const el = findElementByPath(key);
                    if (el) {
                        el.innerHTML = data[key];
                        localStorage.setItem('cv-' + key, data[key]);
                    }
                }
            });
            alert('Đã nhập dữ liệu thành công!');
        } catch (err) {
            alert('File không hợp lệ: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ========================================
// Find element by path
// ========================================
function findElementByPath(path) {
    const parts = path.split(' > ').reverse();
    let current = document.body;
    for (const part of parts) {
        let selector = part;
        if (selector.includes('#')) {
            const id = selector.split('#')[1].split(':')[0];
            return document.getElementById(id);
        }
        const elements = current.querySelectorAll(selector.split(':')[0]);
        if (selector.includes(':nth-of-type')) {
            const match = selector.match(/:nth-of-type\((\d+)\)/);
            if (match) {
                const index = parseInt(match[1]) - 1;
                current = elements[index];
                continue;
            }
        }
        current = elements[0];
        if (!current) return null;
    }
    return current;
}

// ========================================
// Dark Mode Toggle (Optional)
// ========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('cv-dark-mode', document.body.classList.contains('dark-mode'));
}

// Check saved dark mode preference
if (localStorage.getItem('cv-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ========================================
// Console Welcome Message
// ========================================
console.log('%c🎉 CV Template đã sẵn sàng!', 'font-size: 16px; font-weight: bold; color: #2563eb;');
console.log('%cPhím tắt:', 'font-size: 12px; color: #64748b;');
console.log('%c  Ctrl+S  : Tải PDF', 'font-size: 12px; color: #64748b;');
console.log('%c  Ctrl+P  : In CV', 'font-size: 12px; color: #64748b;');
console.log('%c  Ctrl+Shift+R : Khôi phục mẫu', 'font-size: 12px; color: #64748b;');
console.log('%c\nMẹo: Click vào bất kỳ văn bản nào để chỉnh sửa. Dữ liệu tự động lưu vào trình duyệt.', 'font-size: 12px; color: #10b981;');