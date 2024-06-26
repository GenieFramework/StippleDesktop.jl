module StippleDesktop
using NodeJS, GenieFramework

npm = npm_cmd()
js_dir = joinpath(dirname(dirname(pathof(StippleDesktop))), "assets", "js")

function load(;port::Int=8000, width::Int=900, height::Int=900)
    @info "Loading Genie app on port $port"
    Genie.loadapp()
    Genie.up(port,async=true)
    js_dir = joinpath(dirname(dirname(pathof(StippleDesktop))), "assets", "js")
    run(`$npm --prefix $js_dir run start $port $width $height`)
end

function __init__()
    run(`$npm --prefix $js_dir install`)
end

end
