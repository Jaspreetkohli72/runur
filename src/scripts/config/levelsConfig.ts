import RoomLayout1 from "../roomLayouts/roomLayout1";
import RoomLayout2 from "../roomLayouts/roomLayout2";
import RoomLayoutBoss1 from "../roomLayouts/roomLayoutBoss1";
import RoomLayoutBoss2 from "../roomLayouts/roomLayoutBoss2";
import RoomLayoutBoss3 from "../roomLayouts/roomLayoutBoss3";
import RoomLayoutEmpty from "../roomLayouts/roomLayoutEmpty";
import RoomLayoutItemRoom from "../roomLayouts/roomLayoutItemRoom";
import RoomLayoutRandomDefault from "../roomLayouts/roomLayoutRandomDefault";
import RoomLayoutStartRoom from "../roomLayouts/roomLayoutStartRoom";
import RoomLayoutWin from "../roomLayouts/roomLayoutWin";

export default class LevelsConfig {
    public static possibleEnemies = ['EnemyKnight', 'SkelleeEnemy'];
    public static levels: Array<any> = [
        {
            id: 0,
            name: 'level 1',
            rooms: {
                /**
                 * X = start room
                 * 
                 * ###
                 * # #
                 * #X#
                 * # #
                 * ###
                 */
                97: {
                    95: {
                        layout: RoomLayoutItemRoom
                    },
                },
                98: {
                    95: {
                        layout: RoomLayoutItemRoom
                    },
                },
                99: {
                    95: {
                        layout: RoomLayoutRandomDefault
                    },
                    98: {
                        layout: RoomLayoutRandomDefault
                    },
                    99: {
                        layout: RoomLayoutRandomDefault
                    },
                    100: {
                        layout: RoomLayout1
                    },
                    101: {
                        layout: RoomLayoutRandomDefault
                    },
                    102: {
                        layout: RoomLayoutItemRoom
                    },
                },
                100: {
                    90: {
                        layout: RoomLayoutWin
                    },
                    91: {
                        layout: RoomLayoutBoss3
                    },
                    92: {
                        layout: RoomLayoutBoss2
                    },
                    93: {
                        layout: RoomLayoutBoss1
                    },
                    94: {
                        layout: RoomLayoutEmpty
                    },
                    95: {
                        layout: RoomLayoutEmpty
                    },
                    96: {
                        layout: RoomLayoutEmpty
                    },
                    97: {
                        layout: RoomLayoutEmpty
                    },
                    98: {
                        layout: RoomLayoutItemRoom
                    },
                    100: {
                        layout: RoomLayoutStartRoom
                    },
                    102: {
                        layout: RoomLayoutItemRoom
                    },
                },
                101: {
                    95: {
                        layout: RoomLayoutItemRoom
                    },
                    98: {
                        layout: RoomLayoutRandomDefault
                    },
                    99: {
                        layout: RoomLayoutItemRoom
                    },
                    100: {
                        layout: RoomLayout2
                    },
                    101: {
                        layout: RoomLayoutItemRoom
                    },
                    102: {
                        layout: RoomLayoutItemRoom
                    },
                },
                102: {
                    95: {
                        layout: RoomLayoutItemRoom
                    },
                },
                103: {
                    95: {
                        layout: RoomLayoutItemRoom
                    },
                },

            }
        }
    ]

}