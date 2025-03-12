(function () {
    function getDealershipFile() {
        // Extract domain name to determine dealership
        let hostname = window.location.hostname.replace("www.", "").toLowerCase();

        // Mapping domains to GitHub-hosted dealership files
        let repoBase = "https://cdn.jsdelivr.net/gh/kleverboyai/automotive@main/";
        let dealershipFiles = {
            "jameschevrolet.co": "jameschevrolet/dealer-chat-widget.js",
            "anotherdealership.com": "anotherdealership/dealer-chat-widget.js",
            // Add more dealerships here...
        };

        return dealershipFiles[hostname] ? repoBase + dealershipFiles[hostname] : null;
    }

    function loadChatScript() {
        let scriptUrl = getDealershipFile();
        if (!scriptUrl) {
            console.warn("No chat widget configured for this dealership.");
            return;
        }

        let chatScript = document.createElement("script");
        chatScript.src = scriptUrl;
        chatScript.async = true;
        document.body.appendChild(chatScript);
    }

    // Insert button dynamically
    API.insert("page-footer", (elem) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <button id="load-chat-widget" style="position: fixed; bottom: 20px; right: 20px; padding: 20px 25px; background: #D90A0AFF; color: #FFF; border: none; border-radius: 10px; cursor: pointer; z-index: 1000;">
                Available 24/7
            </button>
        `;
        API.append(elem, div);

        // Attach click event to load correct chat script
        document.getElementById("load-chat-widget").addEventListener("click", function () {
            this.remove(); // Remove button after clicking
            loadChatScript();
        });
    });
})();
