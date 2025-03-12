(function () {
    function getDealershipWidgetId(callback) {
        let hostname = window.location.hostname.replace("www.", "").toLowerCase();
        let repoBase = "https://kleverboyai.github.io/klever/dealerships/";

        let dealershipFiles = {
            "jameschevrolet.co": "jameschevrolet.json",
            "jameschrysler.com": "jamescdjr.json",
            "jamesmitsubishigreece.com": "jamesgreece.json",
            "jamesmitsubishi.com": "jamesrome.json",
            "ozmodelz.com": "ozmodelz.json"
            // Add more dealerships here...
        };

        let jsonUrl = dealershipFiles[hostname] ? repoBase + dealershipFiles[hostname] : null;

        if (!jsonUrl) {
            console.warn("No chat widget configured for this dealership.");
            return;
        }

        fetch(jsonUrl)
            .then(response => response.json())
            .then(data => {
                if (data.widgetId) {
                    callback(data.widgetId);
                } else {
                    console.error("Widget ID not found in JSON.");
                }
            })
            .catch(error => console.error("Error loading dealership JSON:", error));
    }

    function loadChatWidget(widgetId) {
        if (!window.chatLoaded) {
            window.chatLoaded = true;

            let loadChatBtn = document.getElementById("load-chat-widget");
            if (loadChatBtn) {
                loadChatBtn.remove();
            }

            let chatScript = document.createElement("script");
            chatScript.src = "https://widgets.leadconnectorhq.com/loader.js";
            chatScript.dataset.resourcesUrl = "https://widgets.leadconnectorhq.com/chat-widget/loader.js";
            chatScript.dataset.widgetId = widgetId;
            chatScript.async = true;
            document.body.appendChild(chatScript);

            chatScript.onload = function () {
                if (window.LC_API) {
                    setTimeout(() => {
                        window.LC_API.open_chat();
                    }, 1000);
                }
            };
        } else {
            if (window.LC_API) {
                window.LC_API.open_chat();
            }
        }
    }

    API.insert("page-footer", (elem) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <button id="load-chat-widget" style="position: fixed; bottom: 20px; right: 20px; padding: 20px 25px; background: #D90A0AFF; color: #FFF; border: none; border-radius: 10px; cursor: pointer; z-index: 1000;">
                Available 24/7
            </button>
        `;
        API.append(elem, div);

        document.getElementById("load-chat-widget").addEventListener("click", function () {
            this.remove(); // Remove button after clicking
            getDealershipWidgetId(loadChatWidget);
        });
    });
})();
