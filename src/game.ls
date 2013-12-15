## GLOBALS
{concat, zip-with, map, filter, flatten} = require 'prelude-ls'
Key = Mousetrap

const FPS = 30
const RES = 40
const DIRS = [
        [\vy -1 \up]
        [\vx 1 \right]
        [\vy 1 \down]
        [\vx -1 \left]
]

parts = [
  [
    "..x...x..."
    "..x.*.x..."
    "..x...x..."
    "..xxxxx..."
    "..x...x..."
    "..x...x..."
    "..x...x..."
    "..xxxxx..."
    "..xxxxx..."
    "..x...x..."
    "..x...x..."
    "..x...x..."
    "..xxxxx..."
    "..x...x..."
    "..x...x..."
    "..x...x..."
  ]
  [
    "......x..."
    "......x..."
    "......x..."
    "......x..."
    "......x..."
    "xxxxxxxxxx"
    "xxxxxxxxxx"
    "xxxx*xxxxx"
    "xxxxxxxxxx"
    "xxxxxxxxxx"
    "......x..."
    "......x..."
    "......x..."
    "......x..."
    "......x..."
  ]
]


# Remove an element from a list (mutates)
remove = (list, member) ->
  ii = list.index-of member
  if -1 < ii
    list.splice ii, 1

fill = (filler, length) ->
  return [filler] * length unless filler.slice
  for z from 0 til length
    filler.slice 0

flop = (a) ->
  # Transpose a 2d array
  width = a.length
  height = a.0.length
  grid = fill (fill 0, width), height
  for x from 0 til width
    for y from 0 til height
      grid[y][x] = a[x][y]
  return grid

grid-append = (a, b) ->
  # take two x/y grids and append them left to right
  zip-with ((x,y) -> x.concat y), a, b

deg-to-rad = -> it * (Math.PI / 180)

## CLASSES

class Point
  (@x, @y) ~>

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
    Point ~~@x, ~~@y

  grid: ~>
    Point ~~(@x/RES), ~~(@y/RES)

class Stage
  ->
    @canvas = document.get-element-by-id \canvas
    @ctx = @canvas.get-context \2d
    @ctx.moz-image-smoothing-enabled = false
    @ctx.webkit-image-smoothing-enabled = false
    @children = []

  clear: ->
    @ctx.clear-rect 0, 0, @canvas.width, @canvas.height

  draw-label: (x, y, text) ->
    @ctx.font = '16pt Arial'
    @ctx.fill-style = \white
    @ctx.fill-text text, x, y

  add: (c) -> @children.push c

  remove: (c) ->
    remove @children, c

  draw: ->
    @clear!
    map (~> it.draw @ctx), @children

class Layer
  ->
    @children = []

  draw: (ctx) ~>
    #TODO consider sorting on z-index
    map (.draw ctx), @children

  add: (c) ~> @children.push c

  remove: (c) ~>
    remove @children, c

  clear: ~> @children = []

  set: ~> @children = [it]

Centerable =
  center: -> Point (@x + (@width / 2)), (@y + (@height / 2))
  move-center-to: (point) ->
    @x = point.x - (@width/2)
    @y = point.y - (@height/2)

class Character implements Centerable
  @all = []
  @tagged = (tag) ->
    @all.filter (x) -> tag in x.tags
  @empty-all = -> @all = []

  (@x, @y, @size=RES, drawable) ->
    @@all.push this
    @tags = []
    @visible = true
    @ticks = []
    @add-tick @physics2D
    @graphics = drawable or Snuffle \#aaa, \#999, \#666

    @width = @height = @size
    @vx = 0; @vy = 0; @last-pos = Point 0, 0
    @last-dir = DIRS.0

  pos: ~> Point @x, @y

  physics2D: ->
    @x += @vx
    @x -= @vx if @vx and is-in-wall this
    @y += @vy
    @y -= @vy if @vy and is-in-wall this
    @last-pos = Point @x, @y

  exit: ~> remove @@all, this

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
    @graphics.draw ctx, (Point @x, @y)
    ctx.restore!
    @x = cx; @y = cy

  tick: -> # Execute functions from a list for flexibility
    for tt in @ticks
       if \remove-me == tt.call this
         @remove-tick tt

  add-tick: (f) ->
    @ticks.push f

  remove-tick: (f) ->
    remove @ticks, f

  intersect: (oo) ~>
    return unless oo
    @x <= oo.x + oo.width and
    oo.x <= @x + @width and
    @y <= oo.y + oo.height and
    oo.y <= @y + @height

  dist: (oo) ->
    mc = x: @x + (@width / 2), y: @y + (@height / 2)
    oc = x: oo.x + (oo.width / 2), y: oo.y + (oo.height / 2)
    Math.sqrt ((mc.x - oc.x) ^ 2) + ((mc.y - oc.y) ^ 2)

  tagged: (tag) ~>
    -1 < @tags.index-of tag

class Critter extends Character
  @commands = 'fffbrrll..'
  @random-pattern = ->
    for x from 0 til 10
      pick @commands

  @DIRS =
    0: {x: 0, y: -1, deg: 0}
    90: {x: 1, y: 0, deg: 90}
    180: {x: 0, y: 1, deg: 180}
    270: {x: -1, y: 0, deg: 270}

  (...) ~>
    super ...
    @rotation = pick(@@DIRS).deg
    @index = 0
    @patterns =[
      @@random-pattern!
      @@random-pattern!
    ]
    @add-tick @wander
    @speed = 10
    @add-tick @rotation-tick
    @active-pattern = pick @patterns

  rotation-tick: ~> @rotation += ~~@va %% 360

  wander: ~>
    return unless window.game.frame % (FPS/2) == 0
    if @index > @active-pattern.length
      @index = 0
      @active-pattern = pick @patterns
    @move @active-pattern[@index]
    @index++

  orientation: (rotation = @rotation) ~>
    ind = ~~((rotation + 44) / 90) %% 4
    @@DIRS[ind*90]

  stop: ~> @vx = 0; @vy = 0; @va = 0

  move: (dir) ~>
    ori = @orientation!
    @stop!
    switch dir
    | \f => @vx = ori.x * @speed; @vy = ori.y * @speed
    | \b => @vx = -ori.x * @speed; @vy = -ori.y * @speed
    | \r => @va =  90 / (FPS/2)
    | \l => @va = -90 / (FPS/2)
    | otherwise => \nothing

draw-arc = (color, start, radius, ctx, rads) ->
  ctx.begin-path!
  ctx.arc start.x, start.y, radius, Math.PI, Math.PI + rads
  ctx.close-path!
  ctx.fill-style = color
  ctx.fill!

draw-circle = (color, start, radius, ctx) ->
  draw-arc color, start, radius, ctx, 2 * Math.PI

draw-semicircle = (color, start, radius, ctx) ->
  draw-arc color, start, radius, ctx, Math.PI

draw-triangle = (color, start, height, ctx, width) ->
  width = height unless width
  ctx.fill-style = color
  ctx.move-to start.x, start.y
  ctx.begin-path!
  ctx.line-to start.x + (width/2), start.y + height
  ctx.line-to start.x - (width/2), start.y + height
  ctx.line-to start.x, start.y
  ctx.close-path!
  ctx.fill!


R = -> ~~(it * Math.random!)

pick = -> it[R(it.length)]

random-color = ->
    palette = \0123456789ABCDEF
    \# + (pick palette) + (pick palette) + (pick palette)

# This is a state machine
class Behavior
  (@method, @tape=null) ->
    @pointer = 0

  perform: (target) ~>
    return null if @pointer > @tape.length
    target[@method] @tape[@pointer]
    @pointer++

class Snuffle
  (@nose, @band, @body, @height=RES) ~>

  draw: (ctx, pos) ~>
    pos = Point pos.x + @height/2, pos.y
    draw-triangle @body, pos, @height, ctx
    draw-triangle @band, pos, 0.4 * @height, ctx
    draw-triangle @nose, pos, 0.3 * @height, ctx

class Shrine
  (@moon, @wedge, @size = 4*RES) ~>

  draw: (ctx, pos) ~>
    pos = Point pos.x + @size/2, pos.y
    ctx.save!
    ctx.global-alpha = 0.9
    draw-semicircle @moon, pos, @size/2, ctx
    draw-triangle @wedge, pos, -@size/2, ctx, @size
    ctx.restore!

class Blok
  (@hour, @decade, @instant, @x=0, @y=0, @solid=false, @height=RES) ->
    @width = @height

  center: ~>
    h2 = ~~(@height/2)
    x: @x + h2, y: @y + h2

  pos:
    Point @x, @y

  draw: (ctx) ~>
    ctx.save!
    ctx.fill-style = @decade
    ctx.fill-rect @x, @y, @height, @height
    #@draw-corners ctx
    h2 = ~~(@height / 2)
    @draw-triangle @hour, @center!, {x: h2, y: h2}, {x: -h2, y: h2}, ctx
    @draw-triangle @hour, @center!, {x: h2, y: -h2}, {x: -h2, y: -h2}, ctx
    if @instant
      h4 = ~~(@height/4)
      # Alternative circle fill
      draw-circle @instant, @center!, h4, ctx
      #ctx.fill-style = @instant
      #ctx.fill-rect @x + h4, @y + h4, 2 * h4, 2 * h4
    ctx.restore!

  draw-corners: (ctx) ->
    h4 = ~~(@height / 4)
    h2 = ~~(@height / 2)
    @draw-triangle @hour, {x: @x, y: @y}, {x: h4, y: 0}, {x: 0, y: h2}
    @draw-triangle @hour, {x: @x + @height, y: @y}, {x: -h4, y: 0}, {x: 0, y: h2}
    @draw-triangle @hour, {x: @x, y: @y + @height}, {x: h4, y: 0}, {x: 0, y: -h2}
    @draw-triangle @hour, {x: @x + @height, y: @y + @height}, {x: -h4, y: 0}, {x: 0, y: -h2}

  draw-triangle: (fill, start, diff1, diff2, ctx) ->
    ctx.move-to start.x, start.y
    ctx.begin-path!
    ctx.line-to start.x + diff1.x, start.y + diff1.y
    ctx.line-to start.x + diff2.x, start.y + diff2.y
    ctx.line-to start.x, start.y
    ctx.close-path!
    ctx.fill-style = fill
    ctx.fill!

empty-blok = (x, y) ->
  new Blok \#ddd, \#ccc, \#ccc, x*RES, y*RES, false
solid-blok = (x, y) ->
  new Blok \black, \black, \white, x*RES, y*RES, true

# This shouldn't be global but where to put it is unclear
# TODO slow, make it smarter
is-in-wall = (oo) ->
  # The character can be in up to four cells
  # For each cell, get the block
  walls = window.game.world.bg.children.0.walls
  collisions = filter (oo.intersect), walls
  return true if collisions.length > 0

class Map
  (@mapping) ~>
    # Mapping is a 2d array of [color color color solid?]
    colors = [\#aca \#bdb \#beb \#ada \#cec \#cfc]
    center-colors = [\#ccc \#cfc]

    @cells = for x from 0 til @mapping.length
      for y from 0 til @mapping.0.length
        m = @mapping[x][y]
        blok = new Blok m.0, m.1, m.2, x*RES, y*RES
        blok.solid = m.3
        blok
    @walls = filter (.solid is true), flatten @cells

  draw: (ctx) ~>
    map (.draw ctx), flatten @cells

  update-walls: ~>
    @walls = filter (.solid is true), flatten @cells

class FlowerStack
  (size = RES*2) ~>
    @flowers = [
      (Flower.random size),
      (Flower.random ~~(size * 0.8)),
      (Flower.random ~~(size * 0.5))
    ]

  draw: (ctx, pos) ~>
    ctx.save!
    ctx.scale @scale, @scale if @scale
    map (.draw ctx, pos), @flowers
    ctx.restore!

  scale: (scale) ~>
    map (.scale = scale), @flowers

class Flower
  @colors = [\black \red \green \blue \purple \orange \white \cyan]
  @random = (size=RES) ~>
    color = pick @colors
    petals = 3 * (R(8) + 1)
    s4 = ~~(size/4)
    cp1 = Point R(size/3), R(size/4) + s4
    cp2 = Point size - R(size/2), R(size/4) + s4
    Flower color, petals, cp1, cp2, size

  (@color, @petals, @cp1, @cp2, @size=RES) ~>
    @opacity = 0.3

  itos: (val, frac=1) ~> # Get value in terms of size
    val * (@size/frac)

  draw: (ctx, pos) ~>
    ctx.save!
    ctx.global-alpha = @opacity
    ctx.fill-style = @color
    ctx.translate pos.x, pos.y
    ctx.move-to 0, 0
    ctx.scale @scale, @scale if @scale
    ctx.rotate deg-to-rad (window.game.frame % (360* 3))
    for p from 0 til @petals
      ctx.begin-path!
      ctx.bezier-curve-to @cp1.x, @cp1.y, @cp2.x, @cp2.y, @size, 0
      ctx.bezier-curve-to @cp2.x, -@cp2.y, @cp1.x, -@cp1.y, 0, 0
      ctx.close-path!
      ctx.fill!
      ctx.rotate deg-to-rad (360 / @petals)
    ctx.restore!

class Room
  @solid = [\black \black \white true]
  @empty = [\#ddd \#ccc \#ccc false]
  @replace-squares = (grid) ->
    map (map @@replace-square), grid

  @replace-square = ->
    switch it
      | \x => @@solid
      | \. => @@empty
      | otherwise => @@empty

  (width=20, height=15) ~>
    @mapping = pick parts
    for xi from 0 til (width/10)-1
      @mapping = grid-append @mapping, pick parts
    @mapping = @@replace-squares (flop @mapping)

    flower-spots = [
      Point RES * 5, RES * 5
      Point RES * 5, RES * 10
      Point RES * 10, RES * 7
      Point RES * 15, RES * 5
      Point RES * 15, RES * 10
    ]

class Game
  (@width, @height, @fps) ->
    @frame = 0
    @pause = false
    @over  = false
    @world = new Stage

    @world.add new Layer
    @world.add new Layer
    @world.add new Layer
    @world.bg = @world.children.0     # walls, the ground itself
    @world.ground = @world.children.1 # flowers and things on the ground
    @world.fg = @world.children.2     # where characters go

    Key.bind \space -> @pause = !@pause
    #Key.bind \z ~>
    #  cc = new Critter RES * 5, RES * 5, RES, (Snuffle \red \white \red)
    #  @world.fg.add cc
    #  window.critter = cc

    Key.bind \a ~> #bomb
      pos = @player.center!.grid!
      grid = @world.bg.children.0.cells
      grid[pos.x][pos.y] = empty-blok pos.x, pos.y
      grid[pos.x + 1]?[pos.y]? = empty-blok pos.x + 1, pos.y
      grid[pos.x - 1]?[pos.y]? = empty-blok pos.x - 1, pos.y
      grid[pos.x][pos.y - 1]? = empty-blok pos.x, pos.y - 1
      grid[pos.x][pos.y + 1]? = empty-blok pos.x, pos.y + 1
      @world.bg.children.0.update-walls!

    #TODO add an intro screen
    @loop-instance = set-interval @loop, 1000 / @fps

    @player = new Character @width/2 - RES/2, @height/2, RES, (Snuffle \#aaa, \#000, \#aaa)
    # bind movement
    for let dd in DIRS
      Key.bind dd.2, ~> @player[dd.0] = 6 * dd.1
      Key.bind dd.2, (~> @player[dd.0] = 0), \keyup

    world-size = Point 10, 3

    stage = Room 100,15

    solid = [\black \black \white true]
    add-wall = (side, grid) -->
      switch side
      | \left   => grid[0] = [solid] * grid[0].length; grid
      | \right  => grid[grid.length-1] = [solid] * grid[grid.length-1].length; grid
      | \top    => map (.0 = solid), grid
      | \bottom => map (.(it.length-1) = solid), grid

    map (-> add-wall it, stage.mapping), [\up \down\ \left \right]

    @load-room stage
    @world.fg.add @player

    @player.add-tick ~>
      #creeping doom
      step = 30
      return if @frame % step > 0
      grid = @world.bg.children.0.cells
      colors = [\black \#666 \#999 null]
      get-color = -> pick colors
      map (.hour = get-color!), grid[~~(@frame/step)]
      map (.decade = get-color!), grid[~~(@frame/step)]
      map (.instant = get-color!), grid[~~(@frame/step)]

    # If we hit the flower, pick it up
#@player.add-tick ~>
#      return if @world-map[@screen.x][@screen.y] == base
#      flower = (filter (.tagged \flower), @world.ground.children)?.0
#      if flower and (not @player.flower) and @player.intersect flower
#        @world-map[@screen.x][@screen.y].flower = null
#        @player.flower = flower
#        @player.flower.graphics.scale 0.5
#        flower.add-tick ~>
#          flower.x = @player.x + @player.width/2
#          flower.y = @player.y


  screen-swap: ~>
    #TODO check if we changed / load in one place
    if @player.y < 0
      @screen = Point @screen.x, @screen.y - 1
      @player.y = @height - @player.height - 1
      @load-room @world-map[@screen.x][@screen.y]
    if @player.y + @player.height > @height
      @screen = Point @screen.x, @screen.y + 1
      @player.y =  1
      @load-room @world-map[@screen.x][@screen.y]
    if @player.x + @player.width > @width
      @screen = Point @screen.x + 1, @screen.y
      @player.x = 1
      @load-room @world-map[@screen.x][@screen.y]
    if @player.x < 0
      @screen = Point @screen.x - 1, @screen.y
      @player.x = @width - @player.width - 1
      @load-room @world-map[@screen.x][@screen.y]

  load-room: (room) ~>
    @world.bg.set Map room.mapping
    @world.ground.clear!
    if @player.flower
      if room.base # we delivered it!
        console.log "Flower collected!"
        ff = @player.flower
        ff.ticks = []
        room.flowers.push ff
        ff.x = @width/4 + ((1+ff.origin.x) * (@width/(2*9))) - RES/2
        ff.y = @height/4 + ((1+ff.origin.y) * (@height/(2*9)))
        @player.flower = false
      else @world.ground.add @player.flower
    @world.ground.add room.shrine if room.shrine
    @world.ground.add room.flower if room.flower # flowers can be taken
    map @world.ground.add, room.flowers if room.flowers
    # TODO add critters etc.

  loop: ~>
    return if @pause
    @frame++
    for cc in Character.all
      cc?.tick!
    # Do camera translation
    @world.ctx.save!
    @world.ctx.translate @width/2 - @player.x, 0
    @world.draw!
    @world.ctx.restore!

    if @over
      @world.draw-label 300 230 "GAME OVER"
      @world.draw-label 260 260 "push r to restart"

window.game = new Game 800, 600, FPS


#TODO
#- pick up flower
#- drop flower at center / base
#- place base
#- wrap map around
#- Add critters
