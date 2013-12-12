prelude = require 'prelude-ls'
$ = require 'jquery-browserify'
Key = Mousetrap
Audio = buzz

#ENGINE
const TICK_COUNT = 90 # how often to move
const RES = 32
const DIRS = [
        [\vy -1 \up]
        [\vx 1 \right]
        [\vy 1 \down]
        [\vx -1 \left]
]

get-dir = (dir) ->
  return 0 unless dir
  for ii from 0 til DIRS.length
    return ii if dir.0 == DIRS[ii].0 and dir.1 == DIRS[ii].1

get-dir-name = (dir) ->
  DIRS[get-dir(dir)].2

get-dir-angle = (dir) ->
  # right is 0 degrees
  90 * (get-dir(dir) - 1)


class Point
  (@x, @y) ->

  angle: (oo) ~>
    dy = oo.y - @y
    dx = oo.x - @x
    Math.atan2 dy, dx

  dist: (oo) ~>
    Math.sqrt  ((@x - oo.x) ^ 2) + ((@y - oo.y) ^ 2)

  midpoint: (oo, percent=0.5) ~>
    ang = @angle oo
    factor = percent * @dist oo
    dx = factor * Math.cos ang
    dy = factor * Math.sin ang
    new Point @x + dx, @y + dy

  clamped: ~>
    new Point ~~@x, ~~@y


class GridNode
  (@pos, neighbors=null) ->
    for dir in <[ up right down left ]>
      @[dir] = neighbors?[dir]

  neighbors: ~>
    prelude.filter (?) <| [@[dir] for dir in <[ up right down left ]>]

window.point = Point
class Stage
  ->
    @canvas = $ \#canvas .get 0
    @ctx = @canvas.get-context \2d
    @ctx.moz-image-smoothing-enabled = false;
    @ctx.webkit-image-smoothing-enabled = false;
    @children = []

  clear: ->
    @ctx.clear-rect 0, 0, @canvas.width, @canvas.height

  draw-label: (x, y, text) ->
    @ctx.font = '16pt Arial'
    @ctx.fill-style = \white
    @ctx.fill-text text, x, y

  add: (c) -> @children.push c

  remove: (c) ->
    if -1 < @children.indexOf c # Without this it would remove things randomly
      @children.splice (@children.indexOf c), 1

  draw: ->
    @clear!
    for c in @children
      c.draw @ctx

# This keeps things stacked correctly
class Layer
  ->
    @children = []

  draw: (ctx) ->
    #TODO maybe sort?
    for c in @children
      c.draw ctx

  add: (c) -> @children.push c

  remove: (c) ->
    if -1 < @children.indexOf c
      @children.splice (@children.indexOf c), 1

class Sprite
  @size = RES
  @all = []
  @image = new Image()
  @image.src = \img/magic.png
  @tagged = (tag) ->
    @all.filter (x) -> tag in x.tags
  @empty = -> @all = []
  @node-occupants = (node, field=\node) ->
    for ss in @all
      ss if ss?[field] == node

  (@x, @y, @fx = 0, @fy = 0, @width = @@size, @height = @@size, @swidth = @width, @sheight = @height) ->
    # fx/fy are the frame position in the sprite sheet
    @@all.push this
    @tags = []
    @visible = true
    @ticks = []

  img: (src) ~> # To override the global setting
    @image = new Image()
    @image.src = src

  center: ~>
    new Point (@x + (@width / 2)), (@y + (@height / 2))

  moveCenterTo: (point) ~>
    @x = point.x - (@width/2)
    @y = point.y - (@height/2)

  exit: ~>
    @@all.splice (@@all.indexOf this), 1

  draw: (ctx) ->
    return unless @visible
    ctx.save!
    cx = @x; cy = @y
    if @alpha
      ctx.global-alpha = @alpha
    if @rotation
      ctx.translate (@x + (@width / 2)), (@y + (@height / 2))
      ctx.rotate (Math.PI / 180) * @rotation
      @x = -(@width / 2)
      @y = -(@height / 2)
    img = @image or @@image # Use a local image if we have it
    ctx.draw-image img, @fx, @fy, @width, @height, ~~@x, ~~@y, @swidth, @sheight
    ctx.restore!
    @x = cx; @y = cy

  tick: -> # Execute functions from a list for flexibility
    for tt in @ticks
       if \remove-me == tt.call this
         @remove-tick tt

  add-tick: (f) ->
    @ticks.push f

  remove-tick: (f) ->
    if -1 < @ticks.indexOf f
      debug \removed
      @ticks.splice (@ticks.indexOf f), 1

  intersect: (oo) ->
    return unless oo
    @x <= oo.x + oo.width and
    oo.x <= @x + @width and
    @y <= oo.y + oo.height and
    oo.y <= @y + @height

  dist: (oo) ->
    mc = x: @x + (@width / 2), y: @y + (@height / 2)
    oc = x: oo.x + (oo.width / 2), y: oo.y + (oo.height / 2)
    Math.sqrt ((mc.x - oc.x) ^ 2) + ((mc.y - oc.y) ^ 2)

# A Character is a Sprite with physics
class Character extends Sprite
  (...) ->
    super ...
    @vx = 0; @vy = 0; @lastPos = x: 0, y: 0
    @add-tick @physics2D
    @add-tick @wall-collide

  wall-collide: -> # This minimal method just makes walls solid
      return false if not world.map
      if @is-in-wall!
        @x = @lastPos.x; @y = @lastPos.y

  physics2D: ->
    @lastPos = x: @x, y: @y
    @x += @vx
    @y += @vy

  is-in-wall: ->
    mm = world.map
    mm.solid-pix @x, @y or
    mm.solid-pix @x+@width, @y or
    mm.solid-pix @x, @y+@height or
    mm.solid-pix @x+@width, @y+@height

# A Map is a grid of Sprites
class Map
  (@mapping, img, @sprite-map, @width = RES, @height = RES) ->
    cells = []
    rows = mapping.length
    cols = mapping[0].length
    @cells = for x til rows
              [0] * cols
    for ii til rows
      for jj til cols
        @cells[ii][jj] =
          new Sprite ii * @width,
              jj * @height,
              @sprite-map[@mapping[ii][jj]].0,
              @sprite-map[@mapping[ii][jj]].1

  tick: ->

  draw: (ctx) ->
    for row in @cells
      for cell in row
        cell.draw ctx

  solid: (x, y) ->
    return false if x < 0 or y < 0
    @sprite-map[@mapping[x][y]].4 > 0

  solid-pix: (x, y) ->
    @solid ~~(x/@width), ~~(y/@height)

# Game-specific code starts here

debug = (words) ->
  console.log words if window.DEBUG

# A player is a character with keyboard controls
class Player extends Character
  @names = <[ ginger cardamom cinnamon ]>
  @players =
    ginger: sprite: [0 0], keys: <[ up right down left z x]>
    cardamom: sprite: [32 0], keys: <[ i l k j [ ] ]>
    cinnamon: sprite: [64 0], keys: <[ w d s a 1 2 ]>
    #TODO rethink these keys... I guess this is mostly 
    #for controllers anyway

  (@number, x, y) ->
    @info = @@players[@@names[number]]
    @keys = @info.keys
    @dirs =
        [@keys.0].concat DIRS.0
        [@keys.1].concat DIRS.1
        [@keys.2].concat DIRS.2
        [@keys.3].concat DIRS.3

    super x, y, @info.sprite.0, @info.sprite.1
    @name = @@names[@number]
    @add-tick @die-by-shades
    @hum = new Audio.sound \snd/charge.mp3
    @add-tick ->
      if @powering # Sound loop check
        ss = @hum.sound
        if ss.currentTime > ss.duration - 0.5
          @hum.load!.play!
    @die-sound = new Audio.sound \snd/death.mp3
    @die-sound.load!
    for let kk in @dirs
      Key.bind kk.0, ~> @facing = kk[1 to]
    Key.bind @keys.4, ~> @attack-left!
    Key.bind @keys.5, ~> @attack-right!

  attack-animation: (duration) ~>
    return if @clinked # already over
    target-node = @node[get-dir-name @attack-dir]
    return unless target-node
    return if target-node == @node
    shot = new Sprite @x, @y, 96, 0
    #TODO scope issue...
    world.stage.add shot
    shot.count = duration
    shot.max-count = duration
    nc = @node.pos
    shot.add-tick ->
      @count--
      @moveCenterTo target-node.pos.midpoint nc, (@count/@max-count)
      if @count < 0
        @visible = false
        \remove-me

  attack: ~>
    return if @clinked # If we bounced don't calculate again
    target-node = @node[get-dir-name @attack-dir]
    return unless target-node # Can't attack walls / dead ends
    targets = Sprite.node-occupants target-node
    for tt in targets
      if tt.dest == target-node or tt.dest == @node
        # attacks can bounce
        if tt.dest[get-dir-name tt.attack-dir] == @node
          return @clink! and tt.clink!
        else tt.die!

  backup: ~> # We bounced and need to stop moving
    @dest = @node
    @moving = false # to prevent redundant checks
    # TODO play bouncy noise

  clink: ~>
    # TODO: play sound
    @clinked = true

  reset: ~> # Reset for the next turn
    @clinked = false
    @facing = null
    @node = @dest if @dest?
    @dest = null
    @moving = false

  die-by-shades: ->
    for ss in Shade.all!
      if @intersect ss
        @die!

  attack-rotate: (clicks) ~> #Change attack facing
    @attack-dir = DIRS[(clicks + get-dir @attack-dir) %% 4]

  attack-right: ~> @attack-rotate 1

  attack-left: ~> @attack-rotate 3

  move-on-beat: ~>
    return if window.frame % 18
    movedir = null
    # First pick the move; arbitrary precedence
    for di from 0 til DIRS.length
      if Key.down-keys[@keys[di]]
        movedir = DIRS[di]; break

    if Key.down-keys[@keys.4] and Key.down-keys[@keys.5]
      console.log \lunging
      #TODO
    else if Key.down-keys[@keys.4]
      console.log \turn-left
      @facing = DIRS[(3 + get-dir @facing) % 4]
    else if Key.down-keys[@keys.5]
      @facing = DIRS[(1 + get-dir @facing) % 4]

    if movedir
      console.log \moving + movedir
      counter = 8
      @add-tick ->
        @[movedir.0] = @speed * movedir.1
        counter--
        if counter < 0
          @[movedir.0] = 0
          return \remove-me

  die: ->
    return unless @visible
    @visible = false
    @die-sound.load!.play!
    Key.unbind @keys
    #TODO unbind keyup stuff too
    window.game-over = true

class Shade extends Character
  @all = ->
    Sprite.tagged \shade

  (...) ->
    super ...
    @fx = 0; @fy = 32
    @speed = 6
    @tags.push \shade
    @hurt-sound = new Audio.sound \snd/hurt.mp3
    @hurt-sound.load!
    @add-tick -> #shades wander randomly
      return if window.frame % 30
      @vx = @vy = 0
      axis = [\vx \vy][~~(Math.random! * 2)]
      dir = [-1 1][~~(Math.random! * 2)]
      @[axis] = dir

  die: ->
    @hurt-sound.load!.play!
    world.stage.remove this
    @exit!

class Item extends Character
  (...) ->
    super ...
    @remove-tick Character.physics2D
    @remove-tick Character.wall-collide
    @tags.push \item

class Sword extends Item
  ->
    super -1000 -1000 64 64
    @add-tick @tick
    @tags.push \sword
    @visible = true

  tick: ->
    return unless @target
    dir = @target.attack-dir or [\vy 1]
    @rotation = get-dir-angle(dir)
    @x = @target.x; @y = @target.y
    @[dir.0.1] += RES * dir.1
    @kill-shades!

  kill-shades: ->
    for ss in Shade.all!
      if @intersect ss
        ss.die!

#TODO make a Game class and fold this in with a pause attr
game-loop = ->
  if window.stop
    return
  window.frame++
  for ss in Sprite.all
    ss?.tick! #Sometimes sprites are removed by other sprites during the loop
  world.draw!
  world.ctx.fillRect 0, (480-16), (640/TICK_COUNT)* (1+(window.frame%TICK_COUNT)), 32
  if window.game-over
    world.draw-label 300 230 "GAME OVER"
    world.draw-label 260 260 "push r to restart"

window.frame = 0 #TODO this goes in the game class

sprite-map =
  ginger: [0 0 32 32]
  cardamom: [32 0 32 32]
  cinnamon: [64 0 32 32]
  shade: [0 32 32 32]
  floor: [0 64 32 32 0]
  'light-floor': [96 64 32 32 0]
  wall: [32 64 32 32 1]


border = (mapping, bfill) ->
  for ci til mapping.0.length
    mapping[0][ci]  = mapping[*-1][ci] = bfill
  for ci til mapping.length
    mapping[ci].0 = mapping[ci][*-1] = bfill
  return mapping

make-grid = (w, h, fill) ->
  for i til w
    for j til h
      fill i, j

checker-floor = (i, j) ->
  [\floor, \light-floor][((i%2) + (j%2)) % 2]


mapping = make-grid 20, 15, checker-floor |> border _, \wall
debug mapping
window.mapping = mapping

start-game = ->
  # Throw up title screen
  Sprite.empty!
  window.world = world = new Stage
  world.add new Layer
  world.add new Layer
  world.add new Layer
  world.map-layer = world.children.0
  world.ground = world.children.1
  world.stage = world.children.2

  Key.bind \space -> window.stop = !window.stop
  window.stop = false

  window.clear-interval window.game-loop-instance if window.game-loop-instance
  window.game-loop-instance = window.set-interval game-loop, 1000 / 30
  window.game-over = false

  title = new Sprite 0 0 0 0 640 480
  title.img \img/tenlinen-title.png
  window.title = title
  world.stage.add title
  Key.bind \space ->
    title.img \img/tenlinen-controls.png
    Key.bind \space ->
      world.stage.remove title
      start-battle!

  # On a, replace it with controls 
  # then start game with countdown

start-battle = ->

  whorl = new Sprite -80 -160 0 0 800 800
  whorl.img \img/whorl.png
  whorl.rotation = 0
  whorl.add-tick -> @rotation += 0.5
  world.map-layer.add whorl

  grid = new Sprite 120 40 0 0 400 400
  grid.img \img/squares.png
  world.ground.add grid
  grid.add-tick -> @alpha = 0.5 + (Math.sin (window.frame / 10)) / 2

  player = new Player 2 192 192
  sword = new Sword
  player.sword = sword
  sword.target = player
  window.player = player
  world.stage.add player
  world.stage.add sword

  player.node = test-grid!.left
  player.move-center-to player.node.pos
  player.add-tick player-move-engine
  player.attack-dir = [\vx -1]
  player2 = new Player 1 10 10
  world.stage.add player2
  player2.sword = new Sword!
  player2.sword.target = player2
  world.stage.add player2.sword
  player2.node = player.node.right.right
  player2.move-center-to player2.node.pos
  player2.add-tick player-move-engine
  player2.attack-dir = [\vx 1]


Key.bind \r -> start-game!
start-game!

swap-player = (mode) ->
  x = player.x
  y = player.y
  world.stage.remove player
  player = new Player 0 x y
  player.mode = mode

window.test-grid = ->
  nodes = []
  cen = new Point (640/2), (480/2)
  step = RES * 5
  center = new GridNode new Point cen.x, cen.y
  up = new GridNode new Point cen.x, cen.y - step
  down = new GridNode new Point cen.x, cen.y + step
  left = new GridNode new Point cen.x - step, cen.y
  right = new GridNode new Point cen.x + step, cen.y
  center.left = left; center.right = right; center.up = up; center.down = down
  up.down = center; up.right = right; up.left = left;
  down.up = center; down.right = right; down.left = left
  left.right = center; left.up = up; left.down = down
  right.left = center; right.up = up; right.down = down
  return center

window.player-move-engine = ->
  switch window.frame % TICK_COUNT
  | 0 => #do move
    if @facing
      console.log \moving
      @moving = get-dir-name @facing
      @dest = @node[@moving] or @node
    else @dest = @node
  | ~~(TICK_COUNT * 0.1) => # Begin move
    console.log \starting-move
    return unless @moving
    @moveCenterTo @center!.midpoint @dest.pos
  | ~~(TICK_COUNT * 0.2) => # Attack if not moving
    console.log \starting-attack
    return if @moving
    @attack!
    @attack-animation ~~(TICK_COUNT * 0.3)
  | ~~(TICK_COUNT * 0.3) => # Finish moving
    console.log \finish-moving
    return unless @moving
    occ = Sprite.node-occupants @dest, \dest
    if occ.length > 1 #TODO bounce if somebody else is going there
      for oc in occ
        console.log oc
        oc.backup!
    else
      @node = @dest
    @moveCenterTo @node.pos
    # Note: currently possible to trade places
  | ~~(TICK_COUNT * 0.4) => # Finish attack
    console.log \finish-attack
    @attack!
    @attack-animation ~~(TICK_COUNT * 0.1) if @moving
  | ~~(TICK_COUNT * 0.5) => @reset! #TODO AI
  | otherwise => \ok # don't need to do anything


# Needed functions:
# attack
# get-attack-dir
# backup
# start game 
# - move players to starting positions
# - start counter

# New flow:
# After starting game (say space)
# - Each beat, 
#   - if a direction is down move that way
#   - if both action keys are down lunge
#   - else if an action key is down turn that way
#   - kill anything that's stabbed
#   - repeat
