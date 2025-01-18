// NOTE: DNS resolving is NOT going through proxy when using this PAC,
// Use https://github.com/salarcode/SmartProxy instead!

function FindProxyForURL(url, host) {
    var socks = "SOCKS5 127.0.0.1:1080";
    var direct = "DIRECT";

    if (isInNet(host, "10.0.0.0", "255.0.0.0")) {
        return direct;
    }
    if (isInNet(host, "172.16.0.0", "255.240.0.0")) {
        return direct;
    }
    if (isInNet(host, "192.168.0.0", "255.255.0.0")) {
        return direct;
    }

    // Use list of list instead of a hash map so rules are inspected in order.
    var proxyRules = [
        ["*google.com", direct],
        ["*googleplex.com", direct],
        ["*myworkday.com", direct],
        ["*youtube.com", direct],
        ["^(twitter|x)\\.com$", socks],
    ];

    function isRegexPattern(pattern) {
        return /[\\^$+?()[\]{}|]/.test(pattern);
    }

    for (var i = 0; i < proxyRules.length; i++) {
        var pattern = proxyRules[i][0];
        var proxy = proxyRules[i][1];

        if (isRegexPattern(pattern)) {
            var regex = new RegExp(pattern, "i");
            if (host.match(regex)) {
                return proxy;
            }
        } else {
            if (shExpMatch(host, pattern)) {
                return proxy;
           }
        }
    }

    return socks;
}
