module.exports = function SyncEmotes(mod) {
    
    let enabled = false,
    syncTarget = 0;
    
    mod.command.add('sync', () => {
        enabled = !enabled;
        syncTarget = 0;
        mod.command.message('(sync-emotes) ' + (enabled === true ? 'Enabled' : 'Disabled'));
    });

    mod.hook('C_SET_TARGET_INFO', 1, event => {
        syncTarget = event.target;
    })
    mod.hook('C_REQUEST_USER_PAPERDOLL_INFO_WITH_GAMEID', 3, event => {
        if(enabled && event.zoom == true) {
            syncTarget = event.gameId;
        }
    })

    mod.hook('S_SOCIAL', 1, event => {
        if (enabled && event.target == syncTarget) {
            mod.command.message(`Target social ${event.animation}`)
            mod.toServer('C_SOCIAL', 1, {
                emote: event.animation,
                unk1: 0
            });
        }
    })
}