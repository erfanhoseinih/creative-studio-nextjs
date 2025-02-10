

#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define PERLIN_YWRAPB 4
#define PERLIN_YWRAP (1 << PERLIN_YWRAPB)
#define PERLIN_ZWRAPB 8
#define PERLIN_ZWRAP (1 << PERLIN_ZWRAPB)
#define PERLIN_SIZE 4095

int perlin_octaves = 4;
float perlin_amp_falloff = 0.5;
float perlin[PERLIN_SIZE + 1];
float pMouseX = 0;
float pMouseY = 0;
float pMouseX2 = 0;
float pMouseY2 = 0;

float dist(float xp0, float yp0, float xp1, float yp1)
{

    float x = xp1 - xp0;
    float y = yp1 - yp0;

    return sqrt(x * x + y * y);
}
float lerp(float o0, float o1, float n)
{
    return (o1 - o0) * n + o0;
}

void initialize_perlin()
{
    for (int i = 0; i <= PERLIN_SIZE; i++)
    {
        perlin[i] = (float)rand() / (float)RAND_MAX;
    }
}

float scaled_cosine(float i)
{
    return 0.5 * (1.0 - cos(i * M_PI));
}

float noise(float x, float y, float z)
{
    if (x < 0)
        x = -x;
    if (y < 0)
        y = -y;
    if (z < 0)
        z = -z;

    int xi = (int)floor(x), yi = (int)floor(y), zi = (int)floor(z);
    float xf = x - xi, yf = y - yi, zf = z - zi;
    float rxf, ryf;

    float r = 0;
    float ampl = 0.5;

    for (int o = 0; o < perlin_octaves; o++)
    {
        int of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

        rxf = scaled_cosine(xf);
        ryf = scaled_cosine(yf);

        float n1 = perlin[of & PERLIN_SIZE];
        n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
        float n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
        n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
        n1 += ryf * (n2 - n1);

        of += PERLIN_ZWRAP;
        n2 = perlin[of & PERLIN_SIZE];
        n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
        float n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
        n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
        n2 += ryf * (n3 - n2);

        n1 += scaled_cosine(zf) * (n2 - n1);

        r += n1 * ampl;
        ampl *= perlin_amp_falloff;

        xi <<= 1;
        xf *= 2;
        yi <<= 1;
        yf *= 2;
        zi <<= 1;
        zf *= 2;

        if (xf >= 1.0)
        {
            xi++;
            xf--;
        }
        if (yf >= 1.0)
        {
            yi++;
            yf--;
        }
        if (zf >= 1.0)
        {
            zi++;
            zf--;
        }
    }
    return r;
}

void noiseDetail(int lod, float falloff)
{
    if (lod > 0)
        perlin_octaves = lod;
    if (falloff > 0)
        perlin_amp_falloff = falloff;
}

EMSCRIPTEN_KEEPALIVE
void noiseSeed(unsigned int seed)
{
    srand(seed);
    initialize_perlin();
}

float constructor(float n, float n1, float n2)
{
    if (n < n1)
    {
        n = n1;
    }
    else if (n > n2)
    {
        n = n2;
    }
    return n;
}

EMSCRIPTEN_KEEPALIVE
void getWaves(float *output, float *outputLen, float animationTime, int width, int height, int lineScale, int lineDetiles, float mouseX, float mouseY)
{
    int indexLine = 0;
    for (int j = -lineDetiles * 3; j < height + lineDetiles * 3; j += lineDetiles)
    {
        indexLine += 2;
    }
    int index = 0;
    for (int i = -lineScale * 3; i < width + lineScale * 3; i += lineScale)
    {

        for (int j = -lineDetiles * 3; j < height + lineDetiles * 3; j += lineDetiles)
        {
            float sn = 0.0009;
            float n = noise(i * sn + animationTime, j * sn, 0) * M_PI * 2 * 6;
            n = pow(n, 1);
            float x = i + sin(n) * 40;
            float y = j + cos(n) * 40;

            float MouseSpaceArea = 150;
            float powNum = 12;
            float mouseMotion = 0.1;
            if (MouseSpaceArea > dist(mouseX, mouseY, x, y))
            {
                if (fabsf(pMouseX - pMouseX2) >= fabsf(mouseX - pMouseX) / 2 || fabsf(pMouseY - pMouseY2) >= fabsf(mouseY - pMouseY) / 2)
                {
                    float dirX = (mouseX - pMouseX) * (1 - dist(mouseX, mouseY, x, y) / MouseSpaceArea);
                    float dirY = (mouseY - pMouseY) * (1 - dist(mouseX, mouseY, x, y) / MouseSpaceArea);
                    x += dirX * powNum;
                    y += dirY * powNum;
                }
            }

            if (animationTime < 0.001)
            {
                mouseMotion = 1;
            }

            output[index] = lerp(output[index], x, mouseMotion);
            index++;
            output[index] = lerp(output[index], y, mouseMotion);
            index++;
        }
    }
    pMouseX2 = pMouseX;
    pMouseY2 = pMouseY;
    pMouseX = mouseX;
    pMouseY = mouseY;

    outputLen[0] = index;
    outputLen[1] = indexLine;
}

EMSCRIPTEN_KEEPALIVE
void *wasmmalloc(size_t n)
{
    return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr)
{
    free(ptr);
}