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

    // Insert Chat Button Without API.insert()
    document.addEventListener("DOMContentLoaded", function () {
        let chatButton = document.createElement("button");
        chatButton.id = "load-chat-widget";
        chatButton.textContent = "Available 24/7";
        chatButton.style.position = "fixed";
        chatButton.style.bottom = "20px";
        chatButton.style.right = "20px";
        chatButton.style.padding = "20px 25px";
        chatButton.style.background = "#D90A0AFF";
        chatButton.style.color = "#FFF";
        chatButton.style.border = "none";
        chatButton.style.borderRadius = "10px";
        chatButton.style.cursor = "pointer";
        chatButton.style.zIndex = "1000";

        document.body.appendChild(chatButton);

        chatButton.addEventListener("click", function () {
            this.remove(); // Remove button after clicking
            getDealershipWidgetId(loadChatWidget);
        });
    });
})();
