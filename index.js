module.exports = function SyncEmotes(mod) {
    
    let enabled = false,
    debug = false,
    syncTarget = 0,
    previousSync = null;

    
    mod.command.add('sync', () => {
        enabled = !enabled;
        syncTarget = 0;
        mod.command.message('(sync-emotes) ' + (enabled === true ? 'Enabled' : 'Disabled'));
    });
    mod.command.add('syncdbg', () => {
        debug = !debug;
        mod.command.message('(sync-emotes) debug' + (debug === true ? 'Enabled' : 'Disabled'));
    });

    mod.hook('C_SET_TARGET_INFO', 1, event => {
        if (debug) mod.command.message('Target has been set via C_SET_TARGET_INFO');
        syncTarget = event.target;
    })
    mod.hook('C_REQUEST_USER_PAPERDOLL_INFO_WITH_GAMEID', 3, event => {
        if(enabled && event.zoom == true) {
            if (debug) mod.command.message('Target has been set via inspect');
            syncTarget = event.gameId;
        }
    })

    mod.hook('S_SOCIAL', 1, event => {
        if (enabled && event.target == syncTarget) {
            //Avoid permanent loop by refusing to repeat within 0.25 seconds
            if (previousSync && (Date.now() - previousSync) < 250) return;
            previousSync = Date.now();
            if (debug) mod.command.message(`Target social ${event.animation}`);
            mod.toServer('C_SOCIAL', 1, {
                emote: event.animation,
                unk1: 0
            });
        }
    })
}